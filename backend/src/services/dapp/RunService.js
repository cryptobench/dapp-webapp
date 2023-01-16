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
      const status = "active";
      await database.insertDapp(userId, appId, appStoreId, status);
      logger.info(`App ${appId} has been launched by user ${userId}`);

      return Ok(appId);
    },
    async stop(userId, appId) {
      assertAppId(appId);

      const [stoppedAppId] = await cliAdapter.stop(appId);
      const status = "dead";
      await database.updateDappStatus(userId, appId, status);
      logger.info(`App ${appId} has been stopped by user ${userId}`);

      return Ok(stoppedAppId);
    },
    async kill(userId, appId) {
      assertAppId(appId);

      const [killedAppId] = await cliAdapter.kill(appId);
      const status = "dead";
      await database.updateDappStatus(userId, appId, status);
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
    async getInstanceInfo(userId, appId) {
      assertAppId(appId);

      const app = await database.findByUserAndAppId(userId, appId);
      if (!app) {
        throw new UserError(`You don't have an app instance with ID ${appId}`);
      }

      return Ok(app);
    },
  };
};
