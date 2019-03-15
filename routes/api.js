const express = require("express"),
  apiRouter = express.Router(),
  User = require("../models/user"),
  auth = require("../controllers/auth.controller"),
  bcrypt = require("bcrypt-nodejs"),
  jwt = require("express-jwt"),
  validator = require("email-validator"),
  axios = require("axios");

var memcache = require("memory-cache");

//Cache server response for dutation
var cache = duration => {
  return (req, res, next) => {
    let key = "_express_" + req.originalUrl || req.url;
    let cachedBody = memcache.get(key);
    if (cachedBody) {
      res.send(cachedBody);
      return;
    } else {
      res.sendResponse = res.send;
      res.send = body => {
        memcache.put(key, body, duration * 1000);
        res.sendResponse(body);
      };
      next();
    }
  };
};

//This is to handle circular request resulting from axios requests to external API's
const handle_axios_error = function(err) {
  if (err.response) {
    const custom_error = new Error(
      err.response.statusText || "Internal server error"
    );
    custom_error.status = err.response.status || 500;
    custom_error.description = err.response.data
      ? err.response.data.message
      : null;
    throw custom_error;
  }
  throw new Error(err);
};

axios.interceptors.response.use(r => r, handle_axios_error);

apiRouter.get("/", (req, res) => {
  res.json({ message: "Welcome to TFJ" });
});

apiRouter
  .route("/signup")

  //create a new user
  .post((req, res) => {
    var user = new User(req.body);

    //validate the email is ok
    if (validator.validate(user.email)) {
      user.save(err => {
        if (err) {
          if (err.code === 11000) {
            //duplicate entry
            console.log("duplicate user...");
            return res.status(403).send(err);
          } else res.status(403).send(err);
        } else
          res.json({
            success: true,
            message: "User created."
          });
      });
    } else
      res.json({
        success: false,
        message: "Email is not in the proper format."
      });
  });

//login user
apiRouter.post("/login", (req, res) => {
  var user = new User(req.body);
  var password = req.body.password;
  console.log("Authenticating user..");

  User.findOne({ email: user.email }, function(err, result) {
    if (err) {
      console.log("error: " + err);
      res.send(err);
    }

    //no user found
    if (!result) {
      res.json({
        success: false,
        message: "No account is associated with this email."
      });
    } else {
      //hash password
      bcrypt.hash(password, result.salt, null, function(err, passwordHash) {
        if (err) {
          console.log(err);
          return err;
        }

        result.comparePassword(passwordHash, function(err, isMatch) {
          if (err) throw err;
          console.log(isMatch);
          if (isMatch) {
            console.log("sign in success");
            //generate jwt for user
            var token = auth.generateToken(user);
            res.json({
              success: true,
              message: "Authentication succeeded.",
              user: result,
              token: token
            });
          } else {
            res.json({
              success: false,
              message: "Authentication failed, bad password."
            });
          }
        });
      });
    }
  });
});

apiRouter
  .route("/users")

  //middleware for all "/users" requests
  .all(jwt({ secret: process.env.SECRET }), (req, res, next) => {
    next();
  })

  //get all users, protect with jwt
  .get((req, res) => {
    User.find({}, "name email").then(data => res.json(data));
  });

//require user to sign in again before these routes on client side
apiRouter
  .route("/user/:email")

  //require token for all routes
  .all(jwt({ secret: process.env.SECRET }), (req, res, next) => {
    next();
  })

  //get the info for one user
  .get((req, res) => {
    User.findOne({ email: req.params.email }, (err, result) => {
      if (err) return res.status(500).send(err);

      res.json(result);
    });
  })

  //update a user's info
  .put((req, res) => {
    //(conditions, update statement, return modified doc)
    User.findOneAndUpdate(
      req.params.email,
      req.body,
      { new: true },
      (err, user) => {
        if (err) res.status(500).send(err);
        res.json(user);
      }
    );
  })

  //delete a user
  .delete((req, res) => {
    console.log(req.params.email);
    User.findOne(req.params.email, (err, result) => {
      if (err) res.status(500).send(err);
      if (result) {
        User.findOneAndRemove({ _id: result._id }, err => {
          if (err) res.status(500).send(err);
          res.json({
            success: true,
            message: "User was delete."
          });
        });
      } else {
        res.json({
          success: false,
          message: "No matching user found."
        });
      }
    });
  });

//uses getRoutesForLatLon method to return top 200 routes for a latitude and longitude
/*
Optional Arguments:
maxDistance - Max distance, in miles, from lat, lon. Default: 30. Max: 200. I am using 2.
maxResults - Max number of routes to return. Default: 50. Max: 500.
minDiff - Min difficulty of routes to return, e.g. 5.6 or V0.
maxDiff - Max difficulty of routes to return, e.g. 5.10a or V2.
*/
apiRouter
  .route("/mtp/routes")
  .post(jwt({ secret: process.env.SECRET }), cache(10), (req, res) => {
    var lat = req.body.lat;
    var long = req.body.long;
    var minDiff = null;
    var maxDiff = null;
    if (req.body.minDiff) minDiff = "&minDiff=" + req.body.minDiff;
    if (req.body.maxDiff) maxDiff = "&maxDiff=" + req.body.maxDiff;

    var host = "https://www.mountainproject.com";
    var path =
      "/data/get-routes-for-lat-lon?lat=" +
      lat +
      "&lon=" +
      long +
      "&maxDistance=2";
    if (minDiff) path2 + minDiff;
    if (maxDiff) path2 + maxDiff;

    path = path + "&key=" + process.env.MTPKEY;

    var url = host + path;
    console.log("URL is " + url);
    axios
      .get(url)
      .then(response => {
        console.log(response);
        res.json(response.data);
      })
      .catch(err => {
        console.log(err);
        res.status(500).send(err);
      });
  });

//used to query Mountain project for info using getUser()
apiRouter
  .route("/mtp/:email")
  .post(jwt({ secret: process.env.SECRET }), cache(10), (req, res) => {
    var host = "https://www.mountainproject.com";
    var path =
      "/data/get-user?email=" + req.params.email + "&key=" + process.env.MTPKEY;
    var url = host + path;
    axios
      .get(url)
      .then(response => {
        console.log(response);
        res.json(response.data);
      })
      .catch(err => {
        console.log(err);
        res.status(500).send(err);
      });
  });

module.exports = apiRouter;
