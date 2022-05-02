module.exports = (userService) => {
  return [
    {
      method: "post",
      path: "/user/register/",
      handler: async (req, res) => {
        const users = await userService.register(req.body);
        return res.send(200, users).end();
      },
    },
  ];
};
