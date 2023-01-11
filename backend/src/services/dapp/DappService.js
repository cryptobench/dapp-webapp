const GetDappsService = require("./GetDappsService");
const ProxyService = require("./ProxyService");
const RunService = require("./RunService");
const ServiceQuotes = require("./ServiceQuotes");

module.exports = ({ database, logger, cliAdapter, redisClient, config }) => {
  return {
    ...GetDappsService({ database, cliAdapter }),
    ...RunService({ database, logger, cliAdapter }),
    ...ProxyService({ redisClient, logger, config }),
    ...ServiceQuotes({ database, logger }),
  };
};
