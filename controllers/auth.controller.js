const jwt = require("jsonwebtoken");

module.exports = {
  generateToken,
  verifyToken
};

function generateToken(user) {
  return jwt.sign(
    {
      name: user.name,
      email: user.email
    },
    process.env.SECRET,
    {
      expiresInMinutes: 1440 // expires in 24 hours
    }
  );
}

function verifyToken(token) {
  jwt.verify(token, process.env.SECRET, (err, decode) => {
    if (err) {
      return [null, err];
    } else {
      return [decoded, null];
    }
  });
}
