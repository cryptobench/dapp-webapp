const GetUserService = require("./GetUserService");
const RegisterService = require("./RegisterService");

module.exports = ({ database, logger }) => {
  return {
    ...GetUserService({ database }),
    ...RegisterService({ database, logger }),
  };
};
