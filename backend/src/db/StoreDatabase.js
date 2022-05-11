const dapps = require("./fixtures/dapps-store.json");
module.exports = function StoreDatabase() {
  return {
    async findDappById(appId) {
      return dapps.find((dapp) => (dapp.id = appId));
    },
    async findAllStoreDapps() {
      return dapps;
    },
  };
};
