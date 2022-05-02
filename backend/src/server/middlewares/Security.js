const helmet = require("helmet");
const restify = require("restify");

module.exports = (server, config) => {
  server.use(
    helmet({
      frameguard: {
        action: "deny",
      },
      referrerPolicy: {
        policy: "same-origin",
      },
      permittedCrossDomainPolicies: {
        permittedPolicies: "none",
      },
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'none'"],
        },
      },
    })
  );
  server.use(restify.plugins.throttle(config.throttle));

  server.pre((req, res, next) => {
    const allowedHeaders = ["Accept-Language", "Content-Type", "User-Agent", "Authorization"];
    res.header("Access-Control-Allow-Headers", allowedHeaders.join(", "));
    if ((config.origins || []).includes(req.header("origin"))) {
      res.header("Access-Control-Allow-Origin", req.header("origin"));
    } else {
      res.header("Access-Control-Allow-Origin", config.origins[0] || "blocked");
    }
    if (req.method === "OPTIONS") {
      const methods = ["POST", "GET", "PUT", "DELETE", "OPTIONS"];
      res.header("Access-Control-Allow-Methods", methods);
      res.json(200);
      return next(false);
    }
    res.removeHeader("Server");
    res.removeHeader("X-Powered-By");
    return next();
  });
};
