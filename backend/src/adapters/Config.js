require("dotenv").config();
const config = require("config");

module.exports = {
  http: config.get("http"),
  authentication: config.get("authentication"),
  logger: config.get("logger"),
  redis: config.get("redis"),
  sqlite: config.get("sqlite"),
  proxy: config.get("proxy"),
  limits: config.get("limits"),
  worker: config.get("worker"),
};
