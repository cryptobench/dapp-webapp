module.exports = (server, controllers, logger) => {
  controllers.forEach((controller) =>
    controller.forEach((route) => {
      server[route.method](route.path, (req, res, next) => {
        Promise.resolve()
          .then(async () => {
            res.header("Cache-Control", route.cache || "no-store");
            return route.handler(req, res, next);
          })
          .catch((error) => {
            if (error.name === "UserError") {
              logger.warn(`[${route.method.toUpperCase()} ${req.url}] ` + error.toString());
              res.send(400, error.toJson() || error.toString());
            } else {
              logger.error(error);
              res.send(500, "Internal Server Error");
            }
            return next(false);
          });
      });
    })
  );
};
