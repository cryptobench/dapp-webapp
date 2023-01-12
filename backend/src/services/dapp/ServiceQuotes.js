const { UserError, Ok } = require("../../utils/Result");
const assert = require("assert");
var cron = require('node-cron');
const { spawn } = require("child_process");


module.exports = ({ database, logger, config }) => {
  const { maxCountUserDapps: USER_DAPP_LIMIT, maxCountGlobalDapps: GLOBAL_DAPP_LIMIT } = config.limits;

  assert(USER_DAPP_LIMIT, "The limit 'maxCountUserDapps' setting is required");
  assert(GLOBAL_DAPP_LIMIT, "The limit 'maxCountGlobalDapps' setting is required");

  function assertUserId(userId) {
    if (!userId) {
      throw new UserError("The id of a user is required");
    }
  }
  
// https://nodejs.org/api/child_process.html#optionsdetached When using the detached option to start a long-running process,
// the process will not stay running in the background after the parent exits unless it is provided
// with a stdio configuration that is not connected to the parent. 
// If the parent's stdio is inherited, the child will remain attached to the controlling terminal.

  cron.schedule('* * * * *', () => {
    const dappManager = spawn('dapp-manager', ['list'], {
      detached: true,
    });
    dappManager.stdout.on('data', (data) => {
        const lines = data.toString().split("\n");
      for (const line of lines) {

        // Skip empty lines
        if (!line) continue;

        const getDappState = spawn('dapp-manager', ['read', 'state', line], {
          detached: true,
        });
        getDappState.on('close', (code) => {
          let status = ""
          if (code === 0) status = "active";
          if (code === 4) status = "unknown_app";
          if (code === 5) status = "dead";
          
          database.updateDappStatus(false, line, status).then((result) => {
            logger.debug(`[Cron worker] Updated status of dapp ${line} to ${status}`);
          }
          );

        });
      }
    });
    dappManager.stderr.on('data', (data) => {
        logger.error(`Cron worker failed to list dapp-manager applications. ${data}`);
    });
   
});


  return {
    async userRunningDappCount(userId) {
      assertUserId(userId);


      
      const queryCount = await database.countUsersRunningDapps(userId);
      const dappCount = queryCount["count"];
      if (!queryCount) {
        throw new UserError(`User with id ${userId} could not be found`);
      }

      if (dappCount < USER_DAPP_LIMIT) {
        logger.info(`Quote checker found ${dappCount} running services for user with id ${userId}`);
        return Ok(queryCount);
      } else {
        throw new UserError(`User with id ${userId} has reached the maximum amount of running services`);
      }
    },
    async userAndGlobalCount(userId) {
      assertUserId(userId);

      const queryUserCount = await database.countUsersRunningDapps(userId);
      const userDappCount = queryUserCount["count"];
      if (!queryUserCount) {
        throw new UserError(`We could not find a user with id ${userId} in our database`);
      }

      const queryGlobalCount = await database.countGlobalRunningDapps();
      const globalDappCount = queryGlobalCount["count"];
      if (!queryGlobalCount) {
        throw new UserError(`An error occured during counting the global amount of running dapps`);
      }

      if (globalDappCount >= GLOBAL_DAPP_LIMIT) {
        throw new UserError(`The global limit of running dapps has been reached. Please try again later.`);
      }

      if (userDappCount >= USER_DAPP_LIMIT) {
        throw new UserError(`You have reached the maximum amount of running services`);
      }

      logger.info(
        `Quote checker found ${userDappCount} running services for user with id ${userId} and a global count of ${globalDappCount} running dapps}`
      );
      return Ok({ global: globalDappCount, user: userDappCount });
    },
    async globalRunningDappCount() {
      const queryGlobalCount = await database.countGlobalRunningDapps();
      const dappCount = queryGlobalCount["count"];

      if (!queryGlobalCount) {
        throw new UserError(`Error counting global amount of running dapps`);
      }
      logger.info(`Quote checker found ${dappCount} running services globally`);

      return Ok(queryGlobalCount);
    },
  };
};
