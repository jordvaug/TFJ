const express = require("express"),
  apiRouter = express.Router(),
  User = require("../models/user"),
  auth = require("../controllers/auth.controller"),
  bcrypt = require("bcrypt-nodejs");

apiRouter.get("/", (req, res) => {
  res.json({ message: "Welcome to TFJ" });
});

apiRouter
  .route("/users")

  //middleware for all "/users" requests
  .all((req, res, next) => {
    next();
  })

  //create a new user
  //password is being saved as null, this is an error
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
            console.log("user is good");
            //generate jwt for user
            var token = auth.generateToken;
            res.json({
              success: true,
              message: "Authentication succeeded."
            });
            return true;
          } else {
            res.json({
              success: false,
              message: "Authentication failed."
            });
            return false;
          }
        });
      });
    }
  });
});

module.exports = apiRouter;
