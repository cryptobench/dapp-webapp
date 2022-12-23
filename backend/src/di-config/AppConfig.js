// Simple primitive Dependency Injection Container

const Database = require("../db/Database");

const UserService = require("../services/user/UserService");
const UserController = require("../controllers/UserController");
const StoreService = require("../services/store/StoreService");
const StoreController = require("../controllers/StoreController");
const DappService = require("../services/dapp/DappService");
const DappController = require("../controllers/DappController");

module.exports = (logger, cliAdapter, dbDriver, redisClient, config) => {
  const database = Database(dbDriver, logger);

  const userService = UserService({ database, logger });
  const userController = UserController(userService);

  const storeService = StoreService({ database, logger });
  const storeController = StoreController(storeService);

  const dappService = DappService({ database, logger, cliAdapter, redisClient, config });
  const dappController = DappController(dappService);

  if (!process.env.YAGNA_APPKEY) {
    logger.error("Make sure that you set YAGNA_APPKEY environment variable, otherwise the requestor app won't work!");
  } else {
    logger.info("Golem Requestor YAGNA_APPKEY is set to '%s'", process.env.YAGNA_APPKEY);
  }

  return {
    controllers: [userController, storeController, dappController],
    database,
  };
};
