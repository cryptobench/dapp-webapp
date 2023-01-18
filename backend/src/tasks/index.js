const AppStatusUpdater = require("./AppStatusUpdater");

function bootStatusWorker(Config, database, Logger, CliAdapter) {
  const schedule = AppStatusUpdater(Config, database, Logger, CliAdapter);

  return async () => {
    await schedule.gracefulShutdown();
  };
}

module.exports = {
  bootStatusWorker,
};
