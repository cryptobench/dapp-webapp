module.exports = (server, config, logger, authentication) => {
  server.pre((req, res, next) => {
    const { url } = req;
    if (url !== "/api/user/register/") {
      const token = req.header("Authorization");
      if (token) {
        authentication.authenticate(token).then((user) => {
          req.user = user;
          next();
        });
      } else {
        res.send(401, "Missing Authorization header").end();
      }
    } else {
      next();
    }
  });
};
