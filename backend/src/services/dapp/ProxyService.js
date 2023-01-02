const { Ok, UserError } = require("../../utils/Result");
const assert = require("assert");

module.exports = ({ redisClient, logger, config }) => {
  const {
    openPortTimeout: OPEN_PORT_TIMEOUT,
    checkPortInterval: CHECK_PORT_INTERVAL,
    checkPortAttempts: CHECK_PORT_ATTEMPTS,
    exposeDomain: PROXY_DOMAIN,
    exposeProtocol: PROXY_PROTOCOL,
  } = config.proxy;

  assert(PROXY_PROTOCOL, "The proxy 'exposeProtocol' setting is required");
  assert(PROXY_DOMAIN, "The proxy 'exposeDomain' setting is required");

  async function requestOpenPortForAppId(appId, port) {
    logger.debug(`[ProxyService] requestOpenPortForAppId: ${appId} ${port}`);
    return redisClient.rPush("gpm", `open ${appId} ${port} ${OPEN_PORT_TIMEOUT}`);
  }

  async function checkIfPortIsAlreadyOpen(appId, port) {
    const appIdForSelectedPort = await redisClient.get(`port.${port}`);
    const isPortOpen = appId === appIdForSelectedPort;
    logger.debug(`[ProxyService] checkIfPortIsAlreadyOpen ${port} | ${appId} => ${isPortOpen}`);
    return isPortOpen;
  }

  async function waitTillPortWillBeReady(appId, port) {
    let portReady = false,
      attempts = 0;

    while (!portReady && ++attempts <= CHECK_PORT_ATTEMPTS) {
      logger.debug(`[ProxyService] waitTillPortWillBeReady ${port} | ${appId} - attempt ${attempts}`);
      const appIdOnPort = await redisClient.get(`port-ready.${port}`);
      await new Promise((r) => setTimeout(r, CHECK_PORT_INTERVAL));
      portReady = appId === appIdOnPort;
    }

    await redisClient.del(`port-ready.${port}`);

    logger.debug(
      `[ProxyService] waitTillPortWillBeReady ${port} | ${appId} - ${
        portReady ? "Port is ready" : "Failed to open the port"
      }`
    );
    return portReady;
  }

  return {
    async getProxyUrl(appId, port) {
      let isAppOnPort = await checkIfPortIsAlreadyOpen(appId, port);

      if (!isAppOnPort) {
        logger.debug(`The port ${port} seems to be available for app ${appId}`);
        await requestOpenPortForAppId(appId, port);
        isAppOnPort = await waitTillPortWillBeReady(appId, port);
      } else {
        logger.debug(`The requested port is already occupied ${appId} ${port}`);
      }

      if (!isAppOnPort) {
        throw new UserError("Failed to open the port to proxy the traffic to the app.");
      }

      return Ok({
        appId,
        port,
        proxyUrl: `${PROXY_PROTOCOL}://${appId}.${PROXY_DOMAIN}/`,
      });
    },
  };
};
