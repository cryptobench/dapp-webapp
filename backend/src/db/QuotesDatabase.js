module.exports = function DappDatabase(db) {
  return {
    countUsersRunningDapps(userId) {
      return new Promise((res, rej) => {
        db.get("SELECT COUNT(*) AS count FROM dapp WHERE userId=? AND status='active'", userId, (err, row) => {
          if (err) rej(err);
          else res(row);
        });
      });
    },
    countGlobalRunningDapps() {
      return new Promise((res, rej) => {
        db.get("SELECT COUNT(*) AS count FROM dapp WHERE status='active'", (err, row) => {
          if (err) rej(err);
          else res(row);
        });
      });
    },
  };
};
