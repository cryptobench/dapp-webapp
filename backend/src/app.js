const AdaptersConfig = require("./di-config/AdaptersConfig");
const AppConfig = require("./di-config/AppConfig");
const { bootHttpServer } = require("./server");
const { bootStatusWorker } = require("./tasks");
const { connectBackendServices } = require("./adapters");

const main = async () => {
  const { SQLite, Redis, Config, Logger, CliAdapter } = AdaptersConfig;

  // Print config for debugging
  Logger.info(Config, "Startup configuration");

  // Connect backend services
  const { services, disconnectBackendServices } = await connectBackendServices(Redis, SQLite);
  const { dbDriver, redisClient } = services;

  const { controllers, database } = AppConfig(Logger, CliAdapter, dbDriver, redisClient, Config);

  const shutdownServer = await bootHttpServer(controllers, database);
  const shutdownWorker = bootStatusWorker(Config, database, Logger, CliAdapter);

  // Register shutdown procedures
  let isShuttingDown = false;
  const shutdown = async (signal) => {
    if (!isShuttingDown) {
      Logger.info({ signal }, "Received shutdown request");
      await shutdownWorker();
      await shutdownServer();
      await disconnectBackendServices();
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
