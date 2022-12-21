module.exports = (server, config, logger, authentication) => {
  server.pre(async (req, res) => {
    try {
      if (req.url !== "/user/register/") {
        const token = req.header("Authorization");
        req.user = await authentication.authenticate(token);
      }
    } catch (error) {
      if (error.name === "AuthenticationError") {
        logger.warn(error.toString());
        res.send(401, error.toString());
        return;
      }

      throw error;
    }
  });
};
