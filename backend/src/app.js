const AdaptersConfig = require("./di-config/AdaptersConfig");
const Server = require("./server/Server")(AdaptersConfig);

Server.init()
  .then(() => Server.run())
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
