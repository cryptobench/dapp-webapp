const { spawn } = require("child_process");

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

  return {
    run,
  };
};
