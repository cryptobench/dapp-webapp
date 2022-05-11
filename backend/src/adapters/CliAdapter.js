const { spawnSync } = require("child_process");

module.exports = (config) => {
  if (!config.command || !config.args) {
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
    return result.stdout.split("\n");
  }
  return {
    async start() {
      return run("start", "--config", config.configPath, config.descriptorPath);
    },
    async stop(appId) {
      return run("stop", "--app-id", appId);
    },
    async kill(appId) {
      return run("kill", "--app-id", appId);
    },
    async list() {
      return run("list");
    },
    async rawData(appId) {
      return run("raw-data", "--app-id", appId, "--no-ensure-alive");
    },
    async rawState(appId) {
      return run("raw-state", "--app-id", appId, "--no-ensure-alive");
    },
  };
};
