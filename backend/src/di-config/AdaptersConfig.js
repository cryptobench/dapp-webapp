const Authentication = require("../adapters/Authentication");
const Config = require("../adapters/Config");
const Logger = require("../adapters/Logger");
const CliAdapter = require("../adapters/CliAdapter");
const Redis = require("../adapters/Redis");

const logger = Logger(Config.logger);
module.exports = {
  Config,
  Authentication,
  Logger: logger,
  CliAdapter: CliAdapter(Config.cli, logger),
  Redis: Redis(Config.redis, logger)
};
