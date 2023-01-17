const winston = require("winston");
require("winston-mongodb");

module.exports = function () {
  winston.ExceptionHandler(
    new winston.transports.File({ filename: "uncaughtExceptions.log" })
  );

  winston.add(winston.transports.File, { filename: "logfile.log" });
  winston.add(winston.transports.mongoDB, { db: "db://url:shouldbeput.here" });
  winston.add(winston.transports.mongoDB, {
    db: "db://url:shouldbeput.here",
    level: "erro",
  });
};
