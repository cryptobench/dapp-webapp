var cron = require("node-cron");
const { spawn } = require("child_process");
const assert = require("assert");

module.exports = (config, dappDatabase, logger, cliAdapter) => {
  const { cronSchedule: CRON_SCHEDULE } = config.worker;
  assert(CRON_SCHEDULE, "The cron schedule for the 'cronSchedule' setting is required");

  cron.schedule(CRON_SCHEDULE, () => {
    const dappManager = spawn("dapp-manager", ["list"], {
      detached: true,
    });
    dappManager.stdout.on("data", async (data) => {
      const lines = data.toString().split("\n");
      for (const appId of lines) {
        // Skip empty lines
        if (!appId) continue;

        const status = await cliAdapter.getStatus(appId);

        await dappDatabase.updateDappStatus(false, appId, status);
        logger.debug(`[Cron worker] Updated status of dapp ${appId} to ${status}`);
      }
    });
  });
};
