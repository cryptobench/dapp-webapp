module.exports = function StoreDatabase() {
  return {
    async findAllStoreDapps() {
      return require("./fixtures/dapps-store.json");
    },
  };
};
