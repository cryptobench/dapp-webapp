module.exports = (dappService, storeService, statsService, usageQuotaService) => {
  return [
    {
      method: "get",
      path: "/dapps/",
      handler: async (req, res) => {
        const dapps = await dappService.getDapps(req.user.id);
        return res.send(200, dapps).end();
      },
    },
    {
      method: "del",
      path: "/dapps/:instanceId",
      handler: async (req, res) => {
        const result = await dappService.delete(req.user.id, req.params.instanceId);
        return res.send(200, result).end();
      },
    },
    {
      method: "post",
      path: "/dapp/start/",
      handler: async (req, res) => {
        const usageQuotaStatuses = await usageQuotaService.getQuotaStats(req.user.id);

        if (
          usageQuotaStatuses.payload.userActiveAppsLimitReached ||
          usageQuotaStatuses.payload.globalActiveAppsLimitReached
        ) {
          const message = usageQuotaStatuses.payload.userActiveAppsLimitReached
            ? "You have reached your active apps limit. "
            : "The global limit of active apps has been reached.";
          return res.send(429, message).end();
        }

        const dapps = await dappService.start(req.user.id, req.body.appStoreId);
        return res.send(201, dapps).end();
      },
    },
    {
      method: "post",
      path: "/dapp/stop/",
      handler: async (req, res) => {
        const dapps = await dappService.stop(req.user.id, req.body.appId);
        return res.send(200, dapps).end();
      },
    },
    {
      method: "post",
      path: "/dapp/kill/",
      handler: async (req, res) => {
        const dapps = await dappService.kill(req.user.id, req.body.appId);
        return res.send(200, dapps).end();
      },
    },
    {
      method: "get",
      path: "/dapp/rawState/:appId",
      handler: async (req, res) => {
        const data = await dappService.getRawState(req.params.appId);
        return res.send(200, data).end();
      },
    },
    {
      method: "get",
      path: "/dapp/rawData/:appId",
      handler: async (req, res) => {
        const data = await dappService.getRawData(req.params.appId);
        return res.send(200, data).end();
      },
    },
    {
      method: "get",
      path: "/dapp/stdout/:appId",
      handler: async (req, res) => {
        const data = await dappService.getStdout(req.params.appId);
        return res.send(200, data).end();
      },
    },
    {
      method: "get",
      path: "/dapp/stderr/:appId",
      handler: async (req, res) => {
        const data = await dappService.getStderr(req.params.appId);
        return res.send(200, data).end();
      },
    },
    {
      method: "get",
      path: "/dapp/log/:appId",
      handler: async (req, res) => {
        const data = await dappService.getLog(req.params.appId);
        return res.send(200, data).end();
      },
    },
    {
      method: "get",
      path: "/dapp/proxyUrl/:appId/:port",
      handler: async (req, res) => {
        const data = await dappService.getProxyUrl(req.params.appId, req.params.port);
        return res.send(200, data).end();
      },
    },
    {
      method: "get",
      path: "/dapp/:appId/stats",
      handler: async (req, res) => {
        const stats = await statsService.getStatsForInstance(req.user.id, req.params.appId);
        return res.send(200, stats).end();
      },
    },
    {
      method: "get",
      path: "/dapp/:appId/descriptor",
      handler: async (req, res) => {
        const appInstance = await dappService.getInstanceInfo(req.user.id, req.params.appId);
        const descriptor = storeService.getDescriptorForApp(appInstance.payload.appStoreId);

        return res.send(200, descriptor).end();
      },
    },
  ];
};
