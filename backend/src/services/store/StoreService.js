const { Ok } = require("../../utils/Result");

module.exports = ({ database }) => {
  return {
    async getDapps() {
      return Ok(await database.findAllStoreDApps());
    },
    getAppById(storeAppId) {
      return Ok(database.findDAppById(storeAppId));
    },
    getDescriptorForApp(storeAppId) {
      return Ok(database.loadDescriptorForApp(storeAppId));
    },
  };
};
