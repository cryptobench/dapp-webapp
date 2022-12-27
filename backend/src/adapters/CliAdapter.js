const { spawn } = require("child_process");

const { EOL } = require("os");

module.exports = (config, logger) => {
  if (!config.command || !config.args) {
    throw new Error("Config for CLI Adapter is not defined");
  }

  function run(...args) {
    return new Promise((resolve) => {
      let stdout = "";

      const result = spawn(config.command, [...config.args, ...args], {
        cwd: config.cwd,
        env: { ...process.env, ...config.env },
        encoding: "utf8",
      }).on("error", function (err) {
        logger.error(`[CLI Adapter] STDERR: ${err}`);
      });

      result.stdout.on("data", (data) => {
        stdout += data;
      });

      result.stderr.on("data", (data) => {
        logger.warn(`[CLI Adapter] STDERR: ${data.toString().trimEnd()}`);
      });

      result.on("error", (err) => {
        logger.error(err, `Running '${config.command}' failed due to an error`);
      });

      result.on("close", (status) => {
        logger.debug(`Executing ${config.command} finished with exit code ${status}`);

        resolve({ stdout, status });
      });
    });
  }

  async function getDetails(command, appId, ensureAlive = true) {
    return run("read", command, appId, ensureAlive ? undefined : "--no-ensure-alive").then((res) => res.stdout);
  }

  return {
    async start(configPath, descriptorPath) {
      if (!configPath || !descriptorPath) {
        throw new Error(`Cannot start dapp without config or descriptor file`);
      }
      return run("start", "--config", configPath, descriptorPath).then((res) => res.stdout?.split(EOL));
    },
    async stop(appId) {
      return run("stop", appId).then((res) => res.stdout?.split(EOL));
    },
    async kill(appId) {
      return run("kill", appId).then((res) => res.stdout?.split(EOL));
    },
    async list() {
      return run("list").then((res) => res.stdout?.split(EOL));
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
      const result = await run("read", "state", appId);
      if (result.status === 0) return "active";
      if (result.status === 4) return "unknown_app";
      if (result.status === 5) return "dead";
    },
    async stats(appId) {
      const result = await run("dapp-stats", appId);

      if (result.status !== 0) {
        throw new Error("The stats command failed to execute, stats are not available");
      }

      return result.stdout;
    },
  };
};
