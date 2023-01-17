const error = require("../middleware/error");
const auth = require("../routes/auth");
const users = require("../routes/users");

module.exports = function (app) {
  // USER ROUTE
  app.use("/api/auth", auth);
  app.use("/api/users", users);
  app.use("/api/courses", courses);

  // ERROR MIDDLEWARE
  app.use(error);
};
