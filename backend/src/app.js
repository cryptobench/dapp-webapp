const AdaptersConfig = require("./di-config/AdaptersConfig");
const AppConfig = require("./di-config/AppConfig");
const Server = require("./server/Server")(AdaptersConfig, AppConfig);

Server.init()
  .then(() => Server.run())
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
