const assert = require("assert");
const schedule = require("node-schedule");

module.exports = (config, dappDatabase, logger, cliAdapter) => {
  const { cronSchedule: CRON_SCHEDULE } = config.worker;
  assert(CRON_SCHEDULE, "The cron schedule for the 'cronSchedule' setting is required");

  schedule.scheduleJob(CRON_SCHEDULE, async () => {
    const dapps = await dappDatabase.getDappsByStatus("active");

    for (const obj of dapps) {
      const status = await cliAdapter.getStatus(obj.appId);

      if (status !== "active") {
        await dappDatabase.updateDappStatus(obj.userId, obj.appId, status);
        logger.debug(`[Cron worker] Updated status of dapp ${obj.appId} to ${status}`);
      }
    }
  });

  return schedule;
};
