const CmdRunner = require("./CmdRunner");

describe("CMD Runner", () => {
  describe("Creation", () => {
    test("Can be created with proper config settings", () => {
      const runner = CmdRunner({
        command: "example-bash-command",
        args: [], // Empty, but still valid
      });

      expect(runner).toBeDefined();
    });

    test("Throws an error when the configuration does not contain required settings", () => {
      expect(() => CmdRunner({}, {})).toThrow("Config for CMD Runner is not defined");
    });
  });
});
