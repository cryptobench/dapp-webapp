const { spawnSync } = require("child_process");

module.exports = (config) => {
  if (!config.command || !config.args || !config.env) {
    throw new Error("Config for CLI Adapter is not defined");
  }
  async function run(...args) {
    const result = spawnSync(config.command, [...config.args, ...args], {
      cwd: config.cwd,
      env: { ...process.env, ...config.env },
      encoding: "utf8",
    });
    if (result.error) {
      throw new Error(`CLI command ${args[0]} error exit code ${result.status}, ${result.error}`);
    }
    return result;
  }
  return {
    async start() {
      return run("start", "--config", config.configPath, config.descriptorPath).then((res) => res.stdout?.split("\n"));
    },
    async stop(appId) {
      return run("stop", "--app-id", appId).then((res) => res.stdout?.split("\n"));
    },
    async kill(appId) {
      return run("kill", "--app-id", appId).then((res) => res.stdout?.split("\n"));
    },
    async list() {
      return run("list").then((res) => res.stdout?.split("\n"));
    },
    async rawData(appId, ensureAlive = true) {
      return run("raw-data", "--app-id", appId, ensureAlive ? undefined : "--no-ensure-alive").then(
        (res) => res.stdout
      );
    },
    async rawState(appId, ensureAlive = true) {
      return run("raw-state", "--app-id", appId, ensureAlive ? undefined : "--no-ensure-alive").then(
        (res) => res.stdout
      );
    },
    async getStatus(appId) {
      const result = await run("raw-state", "--app-id", appId);
      if (result.status === 0) return "active";
      if (result.status === 4) return "dead";
      if (result.status === 5) return "stopped";
    },
  };
};
