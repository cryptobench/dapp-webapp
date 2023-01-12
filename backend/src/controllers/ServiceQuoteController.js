module.exports = (quoteService) => {
  return [
    {
      method: "get",
      path: "/quote/status/global",
      handler: async (req, res) => {
        await quoteService.globalRunningDappCount();
        return res.send(200).end();
      },
    },
  ];
};
