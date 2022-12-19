const { Ok, UserError } = require("../../utils/Result");

const OPEN_PORT_TIMEOUT = 3600;
const CHECK_PORT_INTERVAL = 1000;
const CHECK_PORT_ATTEMPTS = 30;
const PROXY_PREFIX = 'https://someUrl/';

module.exports = ({ redisClient, logger }) => {
    async function requestOpenPortForAppId(appId, port) {
        logger.debug(`[ProxyService] requestOpenPortForAppId: ${appId} ${port}`);
        return redisClient.rPush('gpm', `open ${appId} ${port} ${OPEN_PORT_TIMEOUT}`);
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

        while(!portReady && ++attempts <= CHECK_PORT_ATTEMPTS) {
            logger.debug(`[ProxyService] waitTillPortWillBeReady ${port} | ${appId} - attempt ${attempts}`);
            const appIdOnPort = await redisClient.get(`port-ready.${port}`)
            await new Promise(r => setTimeout(r, CHECK_PORT_INTERVAL))
            portReady = appId === appIdOnPort
        }
        await redisClient.del(`port-ready.${port}`);
        logger.debug(`[ProxyService] waitTillPortWillBeReady ${port} | ${appId} - ${portReady ? 'Port is ready' : 'Failed to open the port'}`);
        return portReady;
    }

    // async function mockResponse(appId, port) {
    //     const diffs = [1,5,8,10];
    //
    //     await Promise.all(diffs.map(async (d) => {
    //         await redisClient.set(`port-ready.${port-d}`, appId);
    //         await new Promise(r => setTimeout(r, 2000));
    //     }))
    //
    //     redisClient.set(`port-ready.${port}`, 'some-other-app-id');
    //
    //     await new Promise(r => setTimeout(r, 2000));
    //     redisClient.set(`port-ready.${port}`, appId);
    //     redisClient.set(`port.${port}`, appId);
    // }

    return {
        async getProxyUrl(appId, port) {
            let isPortOpen = await checkIfPortIsAlreadyOpen(appId, port);
            if(!isPortOpen) {
                await requestOpenPortForAppId(appId, port)
                isPortOpen = await waitTillPortWillBeReady(appId, port)
            }

            if(!isPortOpen) {
                throw new UserError("Failed to open the port");
            }

            return Ok({
                appId,
                port,
                proxyUrl: PROXY_PREFIX + appId
            });

        },
    };
};
