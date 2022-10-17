module.exports = function UserDatabase(db) {
  return {
    async userExist(id) {
      return new Promise((res, rej) => {
        db.get("SELECT * FROM users WHERE id=?", id, (err, row) => {
          if (err) rej(err);
          else res(!!row);
        });
      });
    },
    async insertUser(user) {
      return new Promise((res, rej) => {
        db.run("INSERT INTO users (id, login, name) values (?, ?, ?)", user.id, user.login, user.name, (err) => {
          if (err) rej(err);
          else res();
        });
      });
    },
    async findAllUsers() {
      return new Promise((res, rej) => {
        db.all("SELECT * FROM users", (err, rows) => {
          if (err) rej(err);
          else res(rows);
        });
      });
    },
    async findUser(id) {
      return new Promise((res, rej) => {
        db.get("SELECT * FROM users WHERE id=?", id, (err, row) => {
          if (err) rej(err);
          else res(row);
        });
      });
    },
  };
};
