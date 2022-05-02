module.exports = (dappService) => {
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
      method: "post",
      path: "/dapp/start/",
      handler: async (req, res) => {
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
  ];
};
