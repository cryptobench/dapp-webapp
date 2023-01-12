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
    updateDappStatus(userId=false, appId, dappStatus) {
      return new Promise((res, rej) => {
        if (userId) {
          // Used for the dapp start method, where the userId is known.
        db.run("UPDATE dapp SET status=? WHERE userId=? AND appId=?", dappStatus, userId, appId, (err) => {
          if (err) rej(err);
          else res();
        });
        } else {
          // Cron worker is not aware of userId's , so it simply just updates the status of a specific appId.
          db.run("UPDATE dapp SET status=? WHERE appId=?", dappStatus, appId, (err) => {
            if (err) rej(err);
            else res();
          });
        } 
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
