const HttpServer = require("./Http");
const AppStatusUpdater = require("../tasks/AppStatusUpdater");

const Server = ({ Config, Logger, Authentication, CliAdapter, Redis, SQLite }, AppConfig) => {
  let server, redisClient, dbDriver, dappDatabase;
  return {
    async init() {
      Logger.info(Config, "Startup configuration");
      redisClient = await Redis.connect();
      dbDriver = await SQLite.connect();
      const { controllers, database } = AppConfig(Logger, CliAdapter, dbDriver, redisClient, Config);
      const authentication = Authentication(database);
      await authentication.init();
      dappDatabase = database;
      server = HttpServer({ controllers, authentication, config: Config.http, logger: Logger });
      return server;
    },
    async run() {
      server.listen(Config.http.port, () => Logger.info(`API Dapps listening at ${server.url}`));
      AppStatusUpdater(Config, dappDatabase, Logger, CliAdapter);
    },
    async end() {
      await server.close();
      await dbDriver.close();
      Logger.info(`API Dapps server closed`);
    },
  };
};

module.exports = Server;
