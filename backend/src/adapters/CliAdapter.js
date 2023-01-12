const { EOL } = require("os");

module.exports = (dManagerCmd, dStatsCmd) => {
  async function getDetails(command, appId, ensureAlive = true) {
    const result = await dManagerCmd.run("read", command, appId, ensureAlive ? undefined : "--no-ensure-alive");
    return result.stdout;
  }

  return {
    async start(configPath, descriptorPath) {
      if (!configPath || !descriptorPath) {
        throw new Error(`Cannot start dApp without config or descriptor file`);
      }

      const result = await dManagerCmd.run("start", "--config", configPath, descriptorPath);

      if (result.status !== 0) {
        throw new Error(`Failed to start the application using dapp-manager. Exit status: ${result.status}.`);
      }

      return result.stdout?.split(EOL);
    },
    async stop(appId) {
      return dManagerCmd.run("stop", appId).then((res) => res.stdout?.split(EOL));
    },
    async kill(appId) {
      return dManagerCmd.run("kill", appId).then((res) => res.stdout?.split(EOL));
    },
    async list() {
      return dManagerCmd.run("list").then((res) => res.stdout?.split(EOL));
    },
    async rawData(appId, ensureAlive = true) {
      return getDetails("data", appId, ensureAlive);
    },
    async rawState(appId, ensureAlive = true) {
      return getDetails("state", appId, ensureAlive);
    },
    async stdout(appId, ensureAlive = true) {
      return getDetails("stdout", appId, ensureAlive);
    },
    async stderr(appId, ensureAlive = true) {
      return getDetails("stderr", appId, ensureAlive);
    },
    async log(appId, ensureAlive = true) {
      return getDetails("log", appId, ensureAlive);
    },
    async getStatus(appId) {
      const result = await dManagerCmd.run("read", "state", appId);
      if (result.status === 0) return "active";
      if (result.status === 4) return "unknown_app";
      if (result.status === 5) return "dead";
    },
    async stats(appId) {
      const result = await dStatsCmd.run("stats", appId);

      if (result.status !== 0) {
        throw new Error("The stats command failed to execute, stats are not available");
      }

      return JSON.parse(result.stdout);
    },
    async getSize(descriptorPath) {
      const result = await dStatsCmd.run("size", descriptorPath);

      if (result.status !== 0) {
        throw new Error("The stats command failed to execute, no size information available");
      }

      return JSON.parse(result.stdout);
    },
  };
};
