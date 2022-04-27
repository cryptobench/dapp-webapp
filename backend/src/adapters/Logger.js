const pino = require("pino");
const pinoms = require("pino-multi-stream");
const rfs = require("rotating-file-stream");

module.exports = (loggerConfig) => {
  if (!loggerConfig.streams) {
    throw "Invalid logger configuration. Streams is required";
  }
  const streams = [];

  if (loggerConfig.streams.file) {
    if (!loggerConfig.streams.file.file) {
      throw "Invalid log file config";
    }
    const fileStream = rfs.createStream(loggerConfig.streams.file.file, {
      maxFiles: loggerConfig.streams.file.maxFiles || 20,
      size: loggerConfig.streams.file.maxSize || "2G",
      compress: (x) => x,
      path: loggerConfig.streams.file.path || "./logs",
    });
    streams.push({ stream: fileStream, level: loggerConfig.streams.file.level });
  }

  if (loggerConfig.streams.console) {
    streams.push({
      level: loggerConfig.streams.console.level,
      stream: pinoms.prettyStream({
        opts: { colorize: true, translateTime: true },
      }),
    });
  }

  const pinoOptions = { useLevelLabels: true, level: "debug" };

  return pino(pinoOptions, pinoms.multistream(streams));
};
