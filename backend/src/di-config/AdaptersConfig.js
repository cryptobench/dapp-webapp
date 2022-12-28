const Authentication = require("../adapters/Authentication");
const Config = require("../adapters/Config");
const Logger = require("../adapters/Logger");
const CliAdapter = require("../adapters/CliAdapter");
const SQLite = require("../adapters/SQLite");
const Redis = require("../adapters/Redis");
const CmdRunner = require("../adapters/CmdRunner");

const logger = Logger(Config.logger);
const cmdRunner = CmdRunner(Config.cli, logger);

module.exports = {
  Config,
  Authentication,
  Logger: logger,
  CliAdapter: CliAdapter(Config.cli, logger, cmdRunner),
  SQLite: SQLite(Config.sqlite, logger),
  Redis: Redis(Config.redis, logger),
};
