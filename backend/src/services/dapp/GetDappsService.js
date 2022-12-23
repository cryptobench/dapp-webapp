const { UserError, Ok } = require("../../utils/Result");

module.exports = ({ database, cliAdapter }) => {
  async function getDetails(dataType, appId) {
    if (!appId) throw new UserError("Dapp Id is required");
    const details = await cliAdapter[dataType](appId, false);
    return Ok(details);
  }
  return {
    async getDapps(userId) {
      const userDapps = await database.findDappsByUser(userId);
      const storeDapps = await database.findAllStoreDApps();
      const dapps = [];

      for (const { appId, appStoreId, createdAt } of userDapps) {
        const dappStore = storeDapps.find((app) => app.id === appStoreId);
        const status = await cliAdapter.getStatus(appId);

        dapps.push({
          name: dappStore.name,
          id: appId,
          status: status,
          image: dappStore.image,
          created_at: createdAt,
        });
      }

      return Ok(dapps);
    },
    async getRawState(appId) {
      return getDetails("rawState", appId);
    },
    async getRawData(appId) {
      return getDetails("rawData", appId);
    },
    async getStdout(appId) {
      return getDetails("stdout", appId);
    },
    async getStderr(appId) {
      return getDetails("stderr", appId);
    },
    async getLog(appId) {
      return getDetails("log", appId);
    },
  };
};
