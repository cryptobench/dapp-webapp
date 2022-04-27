const { UserError, Ok } = require("../../utils/Result");

module.exports = ({ database }) => {
  return {
    async get(id) {
      if (!id) throw new UserError("Id is required");
      const user = await database.findUser(id);
      if (!user) throw new UserError("User not found");
      return Ok(user);
    },
  };
};
