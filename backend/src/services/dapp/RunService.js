const { UserError, Ok } = require("../../utils/Result");
const { resolve } = require("path");

module.exports = ({ cliAdapter, database, logger }) => {
  function assertAppId(appId) {
    if (!appId) {
      throw new UserError("dApp instance ID is required");
    }
  }

  return {
    async start(userId, appStoreId) {
      assertAppId(appStoreId);

      const dappStore = await database.findDAppById(appStoreId);
      if (!dappStore) {
        throw new UserError(`dApp ${appStoreId} was not found`);
      }

      const [appId] = await cliAdapter.start(resolve(dappStore.configPath), resolve(dappStore.descriptorPath));
      await database.insertDapp(userId, appId, appStoreId);
      logger.info(`App ${appId} has been launched by user ${userId}`);

      return Ok(appId);
    },
    async stop(userId, appId) {
      assertAppId(appId);

      const [stoppedAppId] = await cliAdapter.stop(appId);
      logger.info(`App ${appId} has been stopped by user ${userId}`);

      return Ok(stoppedAppId);
    },
    async kill(userId, appId) {
      assertAppId(appId);

      const [killedAppId] = await cliAdapter.kill(appId);
      logger.info(`App ${appId} has been killed by user ${userId}`);

      return Ok(killedAppId);
    },
    async delete(userId, appId) {
      assertAppId(appId);

      await database.deleteDApp(userId, appId);
      logger.debug(`App ${appId} was deleted by user ${userId}`);

      return Ok(appId);
    },
    async getStats(userId, appId) {
      assertAppId(appId);

      const feedback = await cliAdapter.stats(appId);
      if (!feedback) {
        throw new Error(`No feedback from CliAdapter for app ${appId}`);
      }

      return Ok(feedback);
    },
  };
};
