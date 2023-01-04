const RunService = require("./RunService");
const { when } = require("jest-when");
const cliAdapter = {};
const logger = {};
const database = {
  findByUserAndAppId: jest.fn(),
};

describe("Run Service", () => {
  const service = RunService({
    cliAdapter,
    logger,
    database,
  });

  describe("getInstanceInfo - obtaining information about particular instance of dApp", () => {
    test("Requires the appId to be provided", async () => {
      await expect(() => service.getInstanceInfo()).rejects.toThrow("dApp instance ID is required");
    });

    test("Throwing an error when the application will not be found", async () => {
      when(database.findByUserAndAppId).calledWith("user-id", "instance").mockResolvedValue(undefined);

      await expect(() => service.getInstanceInfo("user-id", "instance-id")).rejects.toThrow(
        "You don't have an app instance with ID instance-id"
      );
    });

    test("The DB record is returned back without any modification", async () => {
      const record = {
        id: "7",
        configPath: "src/db/fixtures/config/sample_config.yaml",
        descriptorPath: "src/db/fixtures/dapp-store/apps/weather.yaml",
        image: "/app-covers/weather-app.png",
      };

      when(database.findByUserAndAppId).calledWith("user-id", "instance").mockResolvedValue(record);

      await expect(service.getInstanceInfo("user-id", "instance")).resolves.toEqual({
        payload: record,
        success: true,
      });
    });
  });
});
