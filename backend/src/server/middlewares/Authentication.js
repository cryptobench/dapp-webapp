module.exports = (server, config, logger, authentication) => {
  server.pre((req, res, next) => {
    const { url } = req;
    console.log("ur", url);
    if (["/api/user/register/", "/api/store/dapps/"].indexOf(url) === -1) {
      console.log("halloi");
      const token = req.header("Authorization");
      if (token) {
        authentication.authenticate(token).then((user) => {
          req.user = user;
          next();
        });
      } else {
        res.send(401, "Missing Authorization header").end();
      }
      // If the user is registering, we don't need to authenticate them.
    } else {
      next();
    }
  });
};
