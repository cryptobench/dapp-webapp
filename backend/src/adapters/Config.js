require("dotenv").config();
const config = require("config");

module.exports = {
  http: config.get("http"),
  authentication: config.get("authentication"),
  logger: config.get("logger"),
  cli: config.get("cli"),
  redis: config.get("redis"),
};
