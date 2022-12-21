module.exports = function DappDatabase(db) {
  return {
    async findDappsByUser(userId) {
      return new Promise((res, rej) => {
        db.all("SELECT * FROM dapp WHERE userId=?", userId, (err, row) => {
          if (err) rej(err);
          else res(row);
        });
      });
    },
    async insertDapp(userId, appId, appStoreId) {
      return new Promise((res, rej) => {
        db.run(
          "INSERT OR REPLACE INTO dapp (userId, appId, appStoreId, createdAt) values (?, ?, ?, ?)",
          userId,
          appId,
          appStoreId,
          new Date().toISOString(),
          (err) => {
            if (err) rej(err);
            else res();
          }
        );
      });
    },
  };
};
