// Simple primitive Dependency Injection Container

const Database = require("../db/Database");

const UserService = require("../services/user/UserService");
const UserController = require("../controllers/UserController");
const StoreService = require("../services/store/StoreService");
const StoreController = require("../controllers/StoreController");
const DappService = require("../services/dapp/DappService");
const DappController = require("../controllers/DappController");

module.exports = (logger, cliAdapter, dbDriver) => {
  const database = Database(dbDriver);

  const userService = UserService({ database, logger });
  const userController = UserController(userService);

  const storeService = StoreService({ database, logger });
  const storeController = StoreController(storeService);

  const dappService = DappService({ database, logger, cliAdapter });
  const dappController = DappController(dappService);

  return {
    controllers: [userController, storeController, dappController],
    database,
  };
};
