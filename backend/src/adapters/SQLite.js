const sqlite3 = require("sqlite3");

module.exports = (config, logger) => {
  return {
    connect: async () =>
      new Promise((res, rej) => {
        const db = new sqlite3.Database(config.filename, (err) => {
          if (err) rej(err);
          logger.info(`SQLite connected to file://${config.filename}`);
          res(db);
        });
      }),
  };
};
