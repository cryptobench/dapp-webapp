const { spawnSync } = require("child_process");

module.exports = (config, logger) => {
  if (!config.command || !config.args) {
    throw new Error("Config for CLI Adapter is not defined");
  }
  async function run(...args) {
    const result = spawnSync(config.command, [...config.args, ...args], {
      cwd: config.cwd,
      env: { ...process.env, ...config.env },
      encoding: "utf8",
    });
    logger.debug(`[CLI Adapter] Run command: ${args.join(" ")}`);
    if (result.error) {
      throw new Error(`CLI command ${args[0]} error exit code ${result.status}, ${result.error}`);
    }
    if (result.stderr) {
      logger.debug(`[CLI Adapter] STDERR: ${result.stderr}`);
    }
    return result;
  }
  async function getDetails(command, appId, ensureAlive = true) {
    return run(command, "--app-id", appId, ensureAlive ? undefined : "--no-ensure-alive").then((res) => res.stdout);
  }
  return {
    async start(configPath, descriptorPath) {
      if (!configPath || !descriptorPath) {
        throw new Error(`Cannot start dapp without config or descriptor file`);
      }
      return run("start", "--config", configPath, descriptorPath).then((res) => res.stdout?.split("\n"));
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
      return getDetails("raw-data", appId, ensureAlive);
    },
    async rawState(appId, ensureAlive = true) {
      return getDetails("raw-state", appId, ensureAlive);
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
      const result = await run("raw-state", "--app-id", appId);
      if (result.status === 0) return "active";
      if (result.status === 4) return "unknown_app";
      if (result.status === 5) return "dead";
    },
  };
};
