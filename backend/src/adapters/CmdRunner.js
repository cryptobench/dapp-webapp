const { spawn } = require("child_process");

module.exports = (config, logger) => {
  if (!config.command || !config.args) {
    throw new Error("Config for CMD Runner is not defined");
  }

  function run(...args) {
    return new Promise((resolve) => {
      let stdout = "";

      const result = spawn(config.command, [...config.args, ...args], {
        cwd: config.cwd,
        env: { ...process.env, ...config.env },
        encoding: "utf8",
      })
        .on("error", function (err) {
          logger.error(`[CMD Runner] STDERR: ${err}`);
        })
        .on("close", (status) => {
          logger.debug(`Executing ${config.command} finished with exit code ${status}`);

          resolve({ stdout, status });
        });

      result.stdout.on("data", (data) => {
        stdout += data;
      });

      result.stderr.on("data", (data) => {
        logger.warn(`[CMD Runner] STDERR: ${data.toString().trimEnd()}`);
      });
    });
  }

  return {
    run,
  };
};
