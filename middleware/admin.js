const jwt = require("jsonwebtoken");

module.exports = function auth(req, res, next) {
  if (!req.user.isAdmin) return res.status(403).send("Access denied!");

  next();
};
