const HttpServer = require("./Http");
const AppConfig = require("../di-config/AppConfig");

const Server = ({ Config, Logger, Authentication, CliAdapter }) => {
  let server;
  return {
    async init() {
      const { controllers, database } = AppConfig(Logger, CliAdapter);
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
      Logger.info(`API Dapps server closed`);
    },
  };
};

module.exports = Server;
