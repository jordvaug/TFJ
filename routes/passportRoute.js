const express = require("express"),
  passportRouter = express.Router(),
  User = require("../models/user");

passportRouter.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login"
  })
);
