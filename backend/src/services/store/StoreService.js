const { Ok } = require("../../utils/Result");

module.exports = ({ database }) => {
  return {
    async getDapps() {
      return Ok(await database.findAllStoreDapps());
    },
  };
};
