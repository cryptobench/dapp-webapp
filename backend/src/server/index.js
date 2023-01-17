const Server = require("./Server");
const AdaptersConfig = require("../di-config/AdaptersConfig");

async function bootHttpServer(controllers, database) {
  const srv = Server(AdaptersConfig);
  await srv.init(controllers, database);
  await srv.run();

  return async () => {
    await srv.end();
  };
}

module.exports = {
  bootHttpServer,
};
