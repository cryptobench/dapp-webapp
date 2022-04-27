module.exports = (database) => {
  return {
    init: async () => {
      // todo
    },
    authenticate: async (token) => {
      // TODO: really decode in future
      const id = token;
      const user = await database.findUser(id);
      if (!user) {
        // throw new AuthenticationError(`User ${id} not found`);
        // TODO: TMP crate new user if not exists
        const user = {
          id,
          login: "todo",
          name: "todo",
        };
        await database.insertUser(user);
      }
      return user;
    },
  };
};

class AuthenticationError extends Error {
  constructor(message) {
    super(message);
    this.name = "AuthenticationError";
  }
}
