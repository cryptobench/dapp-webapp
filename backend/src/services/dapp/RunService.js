const { UserError, Ok } = require("../../utils/Result");

module.exports = ({ cliAdapter, database, logger }) => {
  return {
    async start(userId, appStoreId) {
      if (!appStoreId) throw new UserError("Dapp Id is required");
      const [appId] = await cliAdapter.start(appStoreId);
      await database.insertDapp(userId, appId, appStoreId);
      logger.info(`App ${appId} has been launched by user ${userId}`);
      return Ok(appId);
    },
    async stop(userId, appId) {
      if (!appId) throw new UserError("Dapp Id is required");
      const [stoppedAppId] = await cliAdapter.stop(appId);
      logger.info(`App ${appId} has been stopped by user ${userId}`);
      return Ok(stoppedAppId);
    },
    async kill(userId, appId) {
      if (!appId) throw new UserError("Dapp Id is required");
      const [killedAppId] = await cliAdapter.kill(appId);
      logger.info(`App ${appId} has been killed by user ${userId}`);
      return Ok(killedAppId);
    },
  };
};
