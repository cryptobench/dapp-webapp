const { spawn } = require("child_process");
const stripColor = require("strip-color");

module.exports = (config, logger) => {
  if (!config.command || !config.args) {
    throw new Error("Config for CMD Runner is not defined");
  }

  function run(...args) {
    return new Promise((resolve) => {
      let stdout = "";

      const cmdLine = [config.command, ...config.args, ...args].join(" ");

      logger.debug(
        {
          cmdLine,
        },
        "Issuing a shell command"
      );

      const result = spawn(config.command, [...config.args, ...args], {
        cwd: config.cwd,
        env: { ...process.env, ...config.env },
        encoding: "utf8",
      })
        .on("error", function (err) {
          logger.error({ cmdLine }, `[CMD Runner] STDERR: ${err}`);
        })
        .on("close", (status) => {
          logger.debug({ cmdLine }, `Executing ${config.command} finished with exit code ${status}`);

          resolve({ stdout: stripColor(stdout), status });
        });

      result.stdout.on("data", (data) => {
        stdout += data;
      });

      result.stderr.on("data", (data) => {
        logger.warn({ cmdLine }, `[CMD Runner] STDERR: ${stripColor(data.toString().trimEnd())}`);
      });
    });
  }

  return {
    run,
  };
};
