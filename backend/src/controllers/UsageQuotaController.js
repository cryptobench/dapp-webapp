module.exports = (usageQuotaService) => {
  return [
    {
      method: "get",
      path: "/usage/limits",
      handler: async (req, res) => {
        const status = await usageQuotaService.getQuotaStats(req.user.id);
        return res.send(200, status).end();
      },
    },
  ];
};
