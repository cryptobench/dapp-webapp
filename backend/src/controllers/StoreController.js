module.exports = (storeService, quoteService) => {
  return [
    {
      method: "get",
      path: "/store/dapps/",
      handler: async (req, res) => {
        const dapps = await storeService.getDapps();
        const globalQuote = await quoteService.globalRunningDappCount();
        if (!globalQuote) {
          return res.send(429, dapps).end();
        }
        return res.send(200, dapps).end();
      },
    },
  ];
};
