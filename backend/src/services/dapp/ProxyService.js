const { Ok, UserError } = require("../../utils/Result");

module.exports = ({ redisClient, logger, config }) => {
  const OPEN_PORT_TIMEOUT = config.proxy.openPortTimeout;
  const CHECK_PORT_INTERVAL = config.proxy.checkPortInterval;
  const CHECK_PORT_ATTEMPTS = config.proxy.checkPortAttemtps;
  const PROXY_PREFIX = config.proxy.baseUrl;

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
      let isPortOpen = await checkIfPortIsAlreadyOpen(appId, port);
      logger.debug(`The requested port is already occupied ${appId} ${port}`);

      if (!isPortOpen) {
        await requestOpenPortForAppId(appId, port);
        isPortOpen = await waitTillPortWillBeReady(appId, port);
      }

      if (!isPortOpen) {
        throw new UserError("Failed to open the port to proxy the traffic to the app.");
      }

      return Ok({
        appId,
        port,
        proxyUrl: PROXY_PREFIX + appId,
      });
    },
  };
};
