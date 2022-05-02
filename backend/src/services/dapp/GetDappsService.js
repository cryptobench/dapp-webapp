const { UserError, Ok } = require("../../utils/Result");

module.exports = ({ database, cliAdapter }) => {
  return {
    async getDapps(userId) {
      const userDapps = await database.findDappsByUser(userId);
      const storeDapps = await database.findAllStoreDapps();
      const cliDappsIds = await cliAdapter.list();
      const dapps = userDapps.map(({ appId, appStoreId, createdAt, status }) => {
        const dappStore = storeDapps.find((app) => app.id === appStoreId);
        return {
          name: dappStore.name,
          id: appId,
          status: cliDappsIds.includes(appId) ? status : "dead",
          icon: dappStore.icon,
          created_at: createdAt,
        };
      });
      return Ok(dapps);
    },
    async getRawState(appId) {
      if (!appId) throw new UserError("Dapp Id is required");
      const rawState = await cliAdapter.rawState(appId);
      return Ok(rawState.join("\n"));
    },
    async getRawData(appId) {
      if (!appId) throw new UserError("Dapp Id is required");
      const rawData = await cliAdapter.rawData(appId);
      return Ok(rawData.join("\n"));
    },
  };
};
