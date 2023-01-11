const { UserError, Ok } = require("../../utils/Result");
const { resolve } = require("path");

module.exports = ({ database, logger }) => {
  function assertUserId(userId) {
    if (!userId) {
      throw new UserError("The id of a user is required");
    }
  }

  return {
    async userRunningDappCount(userId) {
      assertUserId(userId);

      const queryCount = await database.countUsersRunningDapps(userId);
      const dappCount = queryCount['count']
      if (!queryCount) {
        throw new UserError(`User with id ${userId} could not be found`);
      }

      if (dappCount < 3) {
        logger.info(`Quote checker found ${dappCount} running services for user with id ${userId}`);
        return Ok(queryCount);
      } else {
        throw new UserError(`User with id ${userId} has reached the maximum amount of running services`);
      }
    },
    async userAndGlobalCount(userId) {
      assertUserId(userId);

      const queryUserCount = await database.countUsersRunningDapps(userId);
      const userDappCount = queryUserCount['count']
      if (!queryUserCount) {
        throw new UserError(`We could not find a user with id ${userId} in our database`);
      }

      const queryGlobalCount = await database.countGlobalRunningDapps();
      const globalDappCount = queryGlobalCount['count']
      if (!queryGlobalCount) {
        throw new UserError(`An error occured during counting the global amount of running dapps`);
      }

      if (globalDappCount >= 200) {
        throw new UserError(`The global limit of running dapps has been reached. Please try again later.`);
      }

      if (userDappCount >= 3) {
        throw new UserError(`You have reached the maximum amount of running services`);
      }
    
      logger.info(`Quote checker found ${userDappCount} running services for user with id ${userId} and a global count of ${globalDappCount} running dapps}`);
      return Ok({'global': globalDappCount, 'user': userDappCount});
    },
    async globalRunningDappCount() {
      const queryGlobalCount = await database.countGlobalRunningDapps();
      const dappCount = queryGlobalCount['count']

      if (!queryGlobalCount) {
        throw new UserError(`Error counting global amount of running dapps`);
      }
      logger.info(`Quote checker found ${dappCount} running services globally`);

      return Ok(queryGlobalCount);
    },
  };
};
