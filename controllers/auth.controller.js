const jwt = require("jsonwebtoken");

module.exports = {
  generateToken
};

function generateToken(user) {
  return jwt.sign(
    {
      name: user.name,
      email: user.email
    },
    process.env.SECRET,
    {
      expiresIn: 1440 * 60 //meausured in seconds, updated from expiresInMinutes
    }
  );
}
