const fs = require('fs');
const yaml = require('js-yaml');
const dapps = require("./fixtures/dapps-store.json");

const DEFAULT_META = {
  "name": "[Untitled]",
  "description": "",
  "author": "",
};

module.exports = function StoreDatabase() {
  return {
    async findDappById(appId) {
      return dapps.find((dapp) => dapp.id === appId);
    },
    async findAllStoreDapps() {
      dapps.forEach(async (dapp) => {
        let dapp_meta = Object.assign({}, DEFAULT_META);
        try {
          let dapp_data = yaml.load(fs.readFileSync(dapp.descriptorPath));
          if (dapp_data.meta) {
            Object.assign(dapp_meta, dapp_data.meta);
          }
        } catch (e) {
          console.warn(e);
        }
        Object.assign(dapp, {
          "name": dapp_meta.name,
          "author": dapp_meta.author,
          "description": dapp_meta.description,
        })
      });
      return dapps;
    },
  };
};
