const mongoose = require("mongoose");
var bcrypt = require("bcrypt-nodejs");

const UserSchema = new mongoose.Schema({
  _id: { type: mongoose.Schema.ObjectId, auto: true },
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    // Regexp to validate emails
    match: [
      /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      "Please enter a valid email"
    ]
  },
  password: {
    type: String,
    required: true
  },
  salt: {
    type: String
  },
  createdAt: {
    type: Date
  },
  updateAt: {
    type: Date
  },
  roles: [
    {
      type: String
    }
  ]
});

UserSchema.methods.comparePassword = function(candidatePassword, cb) {
  if (candidatePassword === this.password) return cb(null, true);
  return cb(null, false);
};

//use the pre hook to look for the passed email before attempting to save it
UserSchema.pre("save", function(next) {
  var user = this;

  user.createdAt = Date.now();
  //since this is for user creation, updated and created will be the same

  user.updatedAt = Date.now();

  //assign a role of user by default
  user.roles.push("user");

  console.log("creating salt and hash..");
  //give the user a salt and hashed password
  bcrypt.genSalt(10, (err, salt) => {
    if (err) {
      return next(err);
    }
    user.salt = salt;
    bcrypt.hash(user.password, user.salt, null, function(err, hash) {
      if (err) {
        console.log(err);
        return next(err);
      }

      user.password = hash;
      next();
    });
  });
});

UserSchema.post("save", next => {
  console.log("user created.");
  next();
});

//Users collection using UserSchema
module.exports = mongoose.model("users", UserSchema);
