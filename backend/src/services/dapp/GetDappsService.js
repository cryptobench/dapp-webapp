const { UserError, Ok } = require("../../utils/Result");

module.exports = ({ database, cliAdapter }) => {
  return {
    async getDapps(userId) {
      const userDapps = await database.findDappsByUser(userId);
      const storeDapps = await database.findAllStoreDapps();
      const dapps = [];
      for (const { appId, appStoreId, createdAt } of userDapps) {
        const dappStore = storeDapps.find((app) => app.id === appStoreId);
        dapps.push({
          name: dappStore.name,
          id: appId,
          status: await cliAdapter.getStatus(appId),
          icon: dappStore.icon,
          created_at: createdAt,
        });
      }
      return Ok(dapps);
    },
    async getRawState(appId) {
      if (!appId) throw new UserError("Dapp Id is required");
      const rawState = await cliAdapter.rawState(appId, false);
      return Ok(rawState);
    },
    async getRawData(appId) {
      if (!appId) throw new UserError("Dapp Id is required");
      const rawData = await cliAdapter.rawData(appId, false);
      return Ok(rawData);
    },
  };
};
