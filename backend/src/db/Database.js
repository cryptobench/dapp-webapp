const UserDatabase = require("./UserDatabase");
const StoreDatabase = require("./StoreDatabase");
const DappDatabase = require("./DappDatabase");

const Database = (dbDriver, logger) => {
  return {
    ...UserDatabase(dbDriver),
    ...StoreDatabase(dbDriver, logger),
    ...DappDatabase(dbDriver),
  };
};

module.exports = Database;
