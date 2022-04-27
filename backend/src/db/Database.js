const UserDatabase = require("./UserDatabase");
const StoreDatabase = require("./StoreDatabase");
const DappDatabase = require("./DappDatabase");

const Database = (dbDriver = "todo") => {
  return {
    ...UserDatabase(dbDriver),
    ...StoreDatabase(dbDriver),
    ...DappDatabase(dbDriver),
  };
};

module.exports = Database;
