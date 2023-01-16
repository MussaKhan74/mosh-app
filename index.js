require("express-async-errors");
const winston = require("winston");
require("winston-mongodb");
const error = require("./middleware/error");
const auth = require("./routes/auth");
const users = require("./routes/users");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const Fawn = require("fawn");
const startupDebugger = require("debug")("app:startup");
const dbDebugger = require("debug")("app:db");
const config = require("config");
const morgan = require("morgan");
const helmet = require("helmet");
const Joi = require("joi");
const logger = require("./logger");
const courses = require("./routes/courses");
const express = require("express");
const app = express();

// HANDLING UNCAUGHT EXCEPTION
process.on("uncaughtException", (ex) => {
  console.log("WE GO AN UNCAUGHT EXCEPTION");
  winston.error(ex.message, ex);
  process.exit(1);
});

winston.ExceptionHandler(
  new winston.transports.File({ filename: "uncaughtExceptions.log" })
);

// UNHANDLED PROMISE REJECTION
process.on("unhandledRejection", (ex) => {
  console.log("WE GO AN UNCAUGHT EXCEPTION");
  winston.error(ex.message, ex);
  process.exit(1);
});

winston.add(winston.transports.File, { filename: "logfile.log" });
winston.add(winston.transports.mongoDB, { db: "db://url:shouldbeput.here" });
winston.add(winston.transports.mongoDB, {
  db: "db://url:shouldbeput.here",
  level: "erro",
});

// CONFIGURATION
console.log("Applicaiton Name: " + config.get("name"));
console.log("Mail Server: " + config.get("mail.host"));

dotenv.config();

Fawn.init(mongoose);

app.use(express.json());
app.use(express.static("public"));
app.use(helmet());

if (app.get("env") === "development") {
  app.use(morgan("tiny"));
  startupDebugger("Morgan enabled ...");
}

// Db work ...
dbDebugger("Connected to the database....");

app.use(logger);

// USER ROUTE
app.use("/api/auth", auth);
app.use("/api/users", users);
app.use("/api/courses", courses);

// ERROR MIDDLEWARE
app.use(error);

// PORT
const port = process.env.PORT || 3000;

// DB
// mongoose.set("strictQuery", false);
// mongoose
//   .connect(process.env.MONGO_DB)
//   .then(() => console.log("DB CONNECTED"))
//   .catch((error) => console.log(error));

app.listen(port, () => console.log(`Listening on PORT:${port} ...`));
