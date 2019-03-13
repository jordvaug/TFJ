const express = require("express"),
  apiRouter = express.Router(),
  User = require("../models/user"),
  auth = require("../controllers/auth.controller"),
  bcrypt = require("bcrypt-nodejs");

apiRouter.get("/", (req, res) => {
  res.json({ message: "Welcome to TFJ" });
});

apiRouter
  .route("/signup")

  //create a new user
  .post((req, res) => {
    var user = new User(req.body);
    user.save(err => {
      if (err) {
        if (err.code === 11000) {
          //duplicate entry
          console.log("duplicate user...");
          res.send(err);
          return;
        }
      } else return res.status(200);
    });
  });

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
      return;
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
            //generate jwt for user
            var token = auth.generateToken(user);
            res.json({
              success: true,
              message: "Authentication succeeded.",
              token: token
            });
            return true;
          } else {
            res.json({
              success: false,
              message: "Authentication failed, bad password."
            });
            return false;
          }
        });
      });
    }
  });
});

//********************************************************* */
// After signup and login, auth happens for all requests via jwt

apiRouter.use((req, res, next) => {
  //look for the token in request body, url params, and headers
  var token =
    req.body.token || req.query.token || req.headers["x-access-token"];

  if (token) {
    var authRes = auth.verifyToken(token);
    //auth succeeded
    if (authRes[1] === null) {
      req.token = authRes[0];
      next();
    } else {
      return res.status(403).send({
        success: false,
        message: "Token auth failed."
      });
    }
  } else {
    return res.status(403).send({
      success: false,
      message: "No token was provided"
    });
  }
});

apiRouter
  .route("/users")

  //middleware for all "/users" requests
  .all((req, res, next) => {
    next();
  })

  //get all users
  .get((req, res) => {
    User.find({}, "name email").then(data => res.json(data));
  });

//update a user by email
apiRouter.put("/user:email", (req, res) => {
  var user = new User();

  user.findByIdAndUpdate(
    req.params.user._id,
    req.body,
    { new: true },
    (err, user) => {
      if (err) return res.status(500).send(err);
      res.json(user);
    }
  );
});

module.exports = apiRouter;
