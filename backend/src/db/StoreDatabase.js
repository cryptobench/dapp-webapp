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
  function loadMetaForDApp(dapp) {
    try {
      logger.debug({ dapp }, "Loading dApp descriptor from file");

      const descriptor = yaml.load(fs.readFileSync(dapp.descriptorPath));

      const meta = {
        ...DEFAULT_META,
        ...(descriptor.meta ? descriptor.meta : {}),
      };

      return meta;
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
    async findDAppById(appId) {
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
  };
};
