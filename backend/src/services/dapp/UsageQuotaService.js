const { UserError, Ok } = require("../../utils/Result");
const assert = require("assert");

module.exports = ({ database, logger, config }) => {
  const { maxCountUserDapps: USER_DAPP_LIMIT, maxCountGlobalDapps: GLOBAL_DAPP_LIMIT } = config.limits;

  assert(USER_DAPP_LIMIT, "The limit 'maxCountUserDapps' setting is required");
  assert(GLOBAL_DAPP_LIMIT, "The limit 'maxCountGlobalDapps' setting is required");

  function assertUserId(userId) {
    if (!userId) {
      throw new UserError("The id of a user is required");
    }
  }

  return {
    async userActiveDappCount(userId) {
      assertUserId(userId);

      const dappCount = await database.countUsersActiveDapps(userId);
      if (dappCount === false) {
        throw new UserError(`User with id ${userId} could not be found`);
      }

      if (dappCount < USER_DAPP_LIMIT) {
        logger.debug(`Quota checker found ${dappCount} running services for user with id ${userId}`);
        return Ok(dappCount);
      } else {
        throw new UserError(`User with id ${userId} has reached the maximum amount of running services`);
      }
    },
    async getQuotaStats(userId) {
      assertUserId(userId);

      const status = { userActiveAppsLimitReached: false, globalActiveAppsLimitReached: false };

      const userDappCount = await database.countUsersActiveDapps(userId);
      if (userDappCount === false) {
        throw new Error(`We could not find a user with id ${userId} in our database`);
      }

      const globalDappCount = await database.countGlobalActiveDapps();
      if (globalDappCount === false) {
        throw new Error(`An error occured during counting the global amount of running dapps`);
      }

      if (globalDappCount >= GLOBAL_DAPP_LIMIT) {
        status.globalActiveAppsLimitReached = true;
      }

      if (userDappCount >= USER_DAPP_LIMIT) {
        status.userActiveAppsLimitReached = true;
      }

      status.userActiveAppsCount = userDappCount;
      status.globalActiveAppsCount = globalDappCount;

      logger.debug(
        `Quota checker found ${userDappCount} running services for user with id ${userId} and a global count of ${globalDappCount} running dapps}`
      );
      return Ok(status);
    },
    async globalActiveDappCount() {
      const dappCount = await database.countGlobalActiveDapps();
      if (dappCount === false) {
        throw new Error(`Error counting global amount of running dapps`);
      }

      logger.debug(`Quota checker found ${dappCount} running services globally`);

      return Ok(dappCount);
    },
  };
};
