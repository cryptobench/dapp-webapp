module.exports = function DappDatabase() {
  const db = new Map();
  return {
    async findDappsByUser(userId) {
      const userDapps = db.get(userId);
      return userDapps ? Array.from(userDapps.values()) : [];
    },
    async insertDapp(userId, appId, appStoreId) {
      if (!db.has(userId)) db.set(userId, new Map());
      const userDapps = db.get(userId);
      userDapps.set(appId, { appId, appStoreId, createdAt: new Date(), status: "active" });
    },
    async updateDappStatus(userId, appId, status) {
      const userDapps = db.get(userId);
      if (!db.has(userId)) {
        throw new Error(`User ${userId} does not have any dapps`);
      }
      const dapp = userDapps.get(appId);
      if (!dapp) {
        throw new Error(`Dapp ${appId} does not exist`);
      }
      dapp.status = status;
    },
  };
};
