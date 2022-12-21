const Authentication = require("../adapters/Authentication");
const Config = require("../adapters/Config");
const Logger = require("../adapters/Logger");
const CliAdapter = require("../adapters/CliAdapter");
const SQLite = require("../adapters/SQLite");
const Redis = require("../adapters/Redis");

const logger = Logger(Config.logger);
module.exports = {
  Config,
  Authentication,
  Logger: logger,
  CliAdapter: CliAdapter(Config.cli, logger),
  SQLite: SQLite(Config.sqlite, logger),
  Redis: Redis(Config.redis, logger),
};
