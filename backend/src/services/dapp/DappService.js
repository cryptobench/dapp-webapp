const GetDappsService = require("./GetDappsService");
const RunService = require("./RunService");

module.exports = ({ database, logger, cliAdapter }) => {
  return {
    ...GetDappsService({ database, cliAdapter }),
    ...RunService({ database, logger, cliAdapter }),
  };
};
