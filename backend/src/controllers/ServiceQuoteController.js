module.exports = (UsageQuotaService) => {
  return [
    {
      method: "get",
      path: "/usage/limits",
      handler: async (req, res) => {
        const status = await UsageQuotaService.userAndGlobalCount(req.user.id);
        return res.send(200, status).end();
      },
    },
  ];
};
