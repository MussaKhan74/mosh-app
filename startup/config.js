const config = require("config");
const dotenv = require("dotenv");

module.exports = function () {
  console.log("Applicaiton Name: " + config.get("name"));
  console.log("Mail Server: " + config.get("mail.host"));

  dotenv.config();
};
