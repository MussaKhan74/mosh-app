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

// CONFIGURATION
console.log("Applicaiton Name: " + config.get("name"));
console.log("Mail Server: " + config.get("mail.host"));

app.use(express.json());
app.use(express.static("public"));
app.use(helmet());
app.use("/api/courses", courses);

if (app.get("env") === "development") {
  app.use(morgan("tiny"));
  startupDebugger("Morgan enabled ...");
}

// Db work ...
dbDebugger("Connected to the database....");

app.use(logger);

// PORT
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on PORT:${port} ...`));
