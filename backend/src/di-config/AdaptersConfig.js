const Authentication = require("../adapters/Authentication");
const Config = require("../adapters/Config");
const Logger = require("../adapters/Logger");
const CliAdapter = require("../adapters/CliAdapter");
const SQLite = require("../adapters/SQLite");
const Redis = require("../adapters/Redis");
const CmdRunner = require("../adapters/CmdRunner");

const logger = Logger(Config.logger);
const dManagerCmd = CmdRunner(
  {
    command: "dapp-manager",
    args: [],
  },
  logger
);
const dStatsCmd = CmdRunner(
  {
    command: "dapp-stats",
    args: [],
  },
  logger
);

module.exports = {
  Config,
  Authentication,
  Logger: logger,
  CliAdapter: CliAdapter(dManagerCmd, dStatsCmd),
  SQLite: SQLite(Config.sqlite, logger),
  Redis: Redis(Config.redis, logger),
};
