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
      userDapps.set(appId, { appId, appStoreId, createdAt: new Date() });
    },
  };
};
