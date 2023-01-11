const UserDatabase = require("./UserDatabase");
const StoreDatabase = require("./StoreDatabase");
const DappDatabase = require("./DappDatabase");
const QuotesDatabase = require("./QuotesDatabase");

const Database = (dbDriver, logger) => {
  return {
    ...UserDatabase(dbDriver),
    ...StoreDatabase(dbDriver, logger),
    ...DappDatabase(dbDriver),
    ...QuotesDatabase(dbDriver),
  };
};

module.exports = Database;
