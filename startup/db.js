const winston = require("winston");
const mongoose = require("mongoose");

module.exports = function () {
  mongoose.set("strictQuery", false);
  mongoose
    .connect(process.env.MONGO_DB)
    .then(() => winston.info("DB CONNECTED"));
};
