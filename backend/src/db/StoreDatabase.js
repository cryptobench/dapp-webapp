const fs = require("fs");
const yaml = require("js-yaml");
const dapps = require("./fixtures/dapps-store.json");

const DEFAULT_META = {
  name: "[Untitled]",
  description: "",
  author: "",
  image: "",
};

module.exports = function StoreDatabase(_db, logger) {
  function loadDescriptorFromFile(file) {
    return yaml.load(fs.readFileSync(fs.realpathSync(__dirname + "/../../" + file)));
  }

  function loadMetaForDApp(dapp) {
    try {
      logger.debug({ dapp }, "Loading dApp descriptor from file");

      const descriptor = loadDescriptorFromFile(dapp.descriptorPath);

      return {
        ...DEFAULT_META,
        ...(descriptor.meta ? descriptor.meta : {}),
      };
    } catch (err) {
      logger.error(
        {
          dapp,
          err,
        },
        "Failed to load meta information for dApp. Will continue with default meta information."
      );

      return DEFAULT_META;
    }
  }

  return {
    findDAppById(appId) {
      return dapps.find((dapp) => dapp.id === appId);
    },
    async findAllStoreDApps() {
      return dapps.map((dapp) => {
        const meta = loadMetaForDApp(dapp);

        const { name, author, description } = meta;

        return {
          ...dapp,
          name,
          author,
          description,
        };
      });
    },
    loadDescriptorForApp(appId) {
      const app = this.findDAppById(appId);

      if (!app) {
        throw new Error(`App with ID ${appId} does not exist!`);
      }

      return loadDescriptorFromFile(app.descriptorPath);
    },
  };
};
