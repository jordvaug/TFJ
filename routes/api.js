const express = require("express"),
  apiRouter = express.Router(),
  User = require("../models/user"),
  auth = require("../controllers/auth.controller"),
  bcrypt = require("bcrypt-nodejs"),
  jwt = require("express-jwt"),
  validator = require("email-validator");

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
            res.send(err);
            return res.status(403);
          } else res.status(403);
        } else return res.status(200);
      });
    } else
      res.json({
        success: false,
        message: "Email is not in the proper format."
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

apiRouter
  .route("/user/:email")

  //require token for all routes
  .all(jwt({ secret: process.env.SECRET }), (req, res, next) => {
    next();
  })

  //get the info for one user
  .post((req, res) => {
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
    console.log(req.param.email);
    User.findOne(req.param.email, (err, result) => {
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

module.exports = apiRouter;
