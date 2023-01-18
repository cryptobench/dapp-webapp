const GetDappsService = require("./GetDappsService");
const ProxyService = require("./ProxyService");
const RunService = require("./RunService");
const UsageQuotaService = require("./UsageQuotaService");

module.exports = ({ database, logger, cliAdapter, redisClient, config }) => {
  return {
    ...GetDappsService({ database, cliAdapter }),
    ...RunService({ database, logger, cliAdapter }),
    ...ProxyService({ redisClient, logger, config }),
    ...UsageQuotaService({ database, logger, config }),
  };
};
