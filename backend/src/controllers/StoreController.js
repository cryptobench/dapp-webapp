module.exports = (storeService) => {
  return [
    {
      method: "get",
      path: "/store/dapps/",
      handler: async (req, res) => {
        const dapps = await storeService.getDapps();
        return res.send(200, dapps).end();
      },
    },
  ];
};
