const AdaptersConfig = require("./di-config/AdaptersConfig");
const AppConfig = require("./di-config/AppConfig");
const Server = require("./server/Server");
const AppStatusUpdater = require("./tasks/AppStatusUpdater");

const main = async () => {
  const { SQLite, Redis, Config, Logger, CliAdapter } = AdaptersConfig;

  // Print config for debugging
  Logger.info(Config, "Startup configuration");

  // Connect backend services
  const redisClient = await Redis.connect();
  const dbDriver = await SQLite.connect();

  // Create application services
  const { controllers, database } = AppConfig(Logger, CliAdapter, dbDriver, redisClient, Config);

  // Boot the server
  const srv = Server(AdaptersConfig);
  await srv.init(controllers, database);
  await srv.run();

  // Boot workers
  const schedule = AppStatusUpdater(Config, database, Logger, CliAdapter);

  // Register shutdown procedures
  let isShuttingDown = false;
  const shutdown = async (signal) => {
    if (!isShuttingDown) {
      Logger.info({ signal }, "Received shutdown request");
      await schedule.gracefulShutdown();
      await srv.end();
      await dbDriver.close();
      await redisClient.disconnect();
      Logger.info("Finished shutdown sequence");
    }

    isShuttingDown = true;
  };

  process.on("SIGTERM", shutdown);
  process.on("SIGINT", shutdown);
};

main().catch((error) => {
  console.error("Server startup failed due to", error);
  process.exit(1);
});
