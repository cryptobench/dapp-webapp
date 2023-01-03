module.exports = (server, config, logger, authentication) => {
  server.pre(async (req, res) => {
    const { url } = req;
    if (url !== "/api/user/register/") {
      const token = req.header("Authorization");
      if (token) {
        req.user = await authentication.authenticate(token);
      } else {
        res.send(401, "Missing Authorization header").end();
      }
    }
  });
};
