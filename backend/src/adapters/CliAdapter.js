const { EOL } = require("os");

module.exports = (config, logger, cmdRunner) => {
  async function getDetails(command, appId, ensureAlive = true) {
    const result = await cmdRunner.run("read", command, appId, ensureAlive ? undefined : "--no-ensure-alive");
    return result.stdout;
  }

  return {
    async start(configPath, descriptorPath) {
      if (!configPath || !descriptorPath) {
        throw new Error(`Cannot start dApp without config or descriptor file`);
      }

      return cmdRunner.run("start", "--config", configPath, descriptorPath).then((res) => res.stdout?.split(EOL));
    },
    async stop(appId) {
      return cmdRunner.run("stop", appId).then((res) => res.stdout?.split(EOL));
    },
    async kill(appId) {
      return cmdRunner.run("kill", appId).then((res) => res.stdout?.split(EOL));
    },
    async list() {
      return cmdRunner.run("list").then((res) => res.stdout?.split(EOL));
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
      const result = await cmdRunner.run("read", "state", appId);
      if (result.status === 0) return "active";
      if (result.status === 4) return "unknown_app";
      if (result.status === 5) return "dead";
    },
    async stats(appId) {
      const result = await cmdRunner.run("dapp-stats", appId);

      if (result.status !== 0) {
        throw new Error("The stats command failed to execute, stats are not available");
      }

      return JSON.parse(result.stdout);
    },
  };
};
