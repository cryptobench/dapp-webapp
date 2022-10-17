const HttpServer = require("./Http");

const Server = ({ Config, Logger, Authentication, CliAdapter, SQLite }, AppConfig) => {
  let server, dbDriver;
  return {
    async init() {
      dbDriver = await SQLite.connect();
      const { controllers, database } = AppConfig(Logger, CliAdapter, dbDriver);
      const authentication = Authentication(database);
      await authentication.init();
      server = HttpServer({ controllers, authentication, config: Config.http, logger: Logger });
      return server;
    },
    async run() {
      server.listen(Config.http.port, () => Logger.info(`API Dapps listening at ${server.url}`));
    },
    async end() {
      await server.close();
      await dbDriver.close();
      Logger.info(`API Dapps server closed`);
    },
  };
};

module.exports = Server;
