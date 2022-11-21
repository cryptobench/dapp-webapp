const GetDappsService = require("./GetDappsService");
const ProxyService = require("./ProxyService");
const RunService = require("./RunService");

module.exports = ({ database, logger, cliAdapter, redisClient }) => {
  return {
    ...GetDappsService({ database, cliAdapter }),
    ...RunService({ database, logger, cliAdapter }),
    ...ProxyService({ redisClient, logger })
  };
};
