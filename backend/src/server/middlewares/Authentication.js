module.exports = (server, config, logger, authentication) => {
  server.pre(async (req, res, next) => {
    try {
      if (req.url === "/user/register/") return next();
      const token = req.header("Authorization");
      req.user = await authentication.authenticate(token);
      return next();
    } catch (error) {
      if (error.name === "AuthenticationError") {
        logger.warn(error.toString());
        res.send(401, error.toString());
        return false;
      }
      throw error;
    }
  });
};
