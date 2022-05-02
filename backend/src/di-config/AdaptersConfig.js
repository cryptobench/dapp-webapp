const Authentication = require("../adapters/Authentication");
const Config = require("../adapters/Config");
const Logger = require("../adapters/Logger");
const CliAdapter = require("../adapters/CliAdapter");

module.exports = {
  Config,
  Authentication,
  Logger: Logger(Config.logger),
  CliAdapter: CliAdapter(Config.cli),
};
