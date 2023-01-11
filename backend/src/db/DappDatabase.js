module.exports = function DappDatabase(db) {
  return {
    findDappsByUser(userId) {
      return new Promise((res, rej) => {
        db.all("SELECT * FROM dapp WHERE userId=?", userId, (err, row) => {
          if (err) rej(err);
          else res(row);
        });
      });
    },
    findByUserAndAppId(userId, appId) {
      return new Promise((resolve, reject) => {
        return db.get("SELECT * FROM dapp WHERE userId=? AND appId=?", userId, appId, (err, row) => {
          if (err) {
            reject(err);
          } else {
            resolve(row);
          }
        });
      });
    },
    insertDapp(userId, appId, appStoreId, dappStatus) {
      return new Promise((res, rej) => {
        db.run(
          "INSERT OR REPLACE INTO dapp (userId, appId, appStoreId, status, createdAt) values (?, ?, ?, ?, ?)",
          userId,
          appId,
          appStoreId,
          dappStatus,
          new Date().toISOString(),
          (err) => {
            if (err) rej(err);
            else res();
          }
        );
      });
    },
    updateDappStatus(userId, appId, dappStatus) {
      return new Promise((res, rej) => {
        db.run("UPDATE dapp SET status=? WHERE userId=? AND appId=?", dappStatus, userId, appId, (err) => {
          if (err) rej(err);
          else res();
        });
      });
    },
    deleteDApp(userId, appId) {
      return new Promise((res, rej) => {
        db.run("DELETE FROM dapp WHERE userId=? AND appId=?", userId, appId, (err) => {
          if (err) rej(err);
          else res();
        });
      });
    },
  };
};
