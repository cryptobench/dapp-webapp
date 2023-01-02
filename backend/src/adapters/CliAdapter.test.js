const CliAdapter = require("./CliAdapter");
const { when } = require("jest-when");

const dStatsCmd = {
  run: jest.fn(),
};

const dManagerCmd = {
  run: jest.fn(),
};

describe("CLI Adapter", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe("start - Starting new application instances", () => {
    test("trhows an error when the dapp-manager fails to return 0 for start", async () => {
      const adapter = CliAdapter(dManagerCmd, dStatsCmd);

      when(dManagerCmd.run).calledWith("start", "--config", "config-path", "descriptor-path").mockResolvedValue({
        status: 6,
        stdout: "",
      });

      await expect(adapter.start("config-path", "descriptor-path")).rejects.toThrow(
        "Failed to start the application using dapp-manager. Exit status: 6."
      );
    });
  });

  describe("stats - Getting stats for a particular app", () => {
    test("returns JSON with agreed stats", async () => {
      const adapter = CliAdapter(dManagerCmd, dStatsCmd);

      // Given
      const appId = "some-app-id";

      const agreedShape = {
        app: {
          state_changes: 3,
          launched_successfully: true,
          estimated_time_to_launch: "0:02:00",
        },
        nodes: {
          db: {
            0: {
              state_changes: 3,
              launched_successfully: true,
              estimated_time_to_launch: "0:02:00",
            },
          },
          http: {
            0: {
              state_changes: 3,
              launched_successfully: true,
              estimated_time_to_launch: "0:02:00",
            },
          },
        },
      };

      // When
      when(dStatsCmd.run)
        .calledWith("stats", appId)
        .mockResolvedValue({
          status: 0,
          stdout: JSON.stringify(agreedShape),
        });

      const result = await adapter.stats(appId);

      // Then
      expect(result).toEqual(agreedShape);
    });

    test("throws an error when the result code is non-zero", async () => {
      // Given
      const appId = "some-app-id";

      // When
      when(dStatsCmd.run).calledWith("stats", appId).mockResolvedValue({
        status: 2,
        stdout: "",
      });

      const adapter = CliAdapter(dManagerCmd, dStatsCmd);

      // Then
      await expect(adapter.stats(appId)).rejects.toThrow(
        "The stats command failed to execute, stats are not available"
      );
    });
  });
});
