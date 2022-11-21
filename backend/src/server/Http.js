const restify = require("restify");
const AuthenticationMiddleware = require("./middlewares/Authentication");
const SecurityMiddleware = require("./middlewares/Security");
const RoutesMiddleware = require("./middlewares/Routes");

module.exports = ({ controllers, authentication, config, logger }) => {
  const server = restify.createServer();
  server.use(restify.plugins.pre.sanitizePath());
  server.use(restify.plugins.queryParser());
  server.use(restify.plugins.bodyParser());
  SecurityMiddleware(server, config);
  AuthenticationMiddleware(server, config, logger, authentication);
  RoutesMiddleware(server, config, controllers, logger);
  return server;
};
