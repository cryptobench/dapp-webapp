module.exports = function UserDatabase() {
  const db = new Map();
  return {
    async userExist(id) {
      return db.has(id);
    },
    async insertUser(user) {
      db.set(user.id, user);
    },
    async findAllUsers() {
      return Array.from(db.values());
    },
    async findUser(id) {
      return db.get(id);
    },
  };
};
