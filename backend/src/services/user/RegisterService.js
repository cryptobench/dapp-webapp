const { Ok } = require("../../utils/Result");
const { v4: uuidv4 } = require("uuid");

module.exports = ({ database, logger }) => {
  return {
    async register({ login, name }) {
      const user = {
        id: uuidv4(),
        login: login || "todo",
        name: name || "todo",
      };
      await database.insertUser(user);
      logger.info(`User ${user.id} has been registered`);
      return Ok(user);
    },
  };
};
