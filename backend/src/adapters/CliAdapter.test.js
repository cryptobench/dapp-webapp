const CliAdapter = require("./CliAdapter");
const { when } = require("jest-when");

const config = {};
const logger = {};

const runner = {
  run: jest.fn(),
};

describe("CLI Adapter", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe("Getting stats for a particular app", () => {
    test("dapp-stats [appId] returns JSON with agreed stats", async () => {
      const adapter = CliAdapter(config, logger, runner);

      // Given
      const appId = "some-app-id";

      const agreedShape = {
        app: {
          state_changes: 3,
          launched_successfully: true,
          estimated_time_to_launch: "0:02:00",
          estimated_working_time: "0:02:00",
        },
        nodes: {
          db: {
            0: {
              state_changes: 3,
              launched_successfully: true,
              estimated_time_to_launch: "0:02:00",
              estimated_working_time: "0:02:00",
            },
          },
          http: {
            0: {
              state_changes: 3,
              launched_successfully: true,
              estimated_time_to_launch: "0:02:00",
              estimated_working_time: "0:02:00",
            },
          },
        },
      };

      // When
      when(runner.run)
        .calledWith("dapp-stats", appId)
        .mockResolvedValue({
          status: 0,
          stdout: JSON.stringify(agreedShape),
        });

      const result = await adapter.stats(appId);

      // Then
      expect(result).toEqual(agreedShape);
    });

    test("dapp-stats throws an error when the result code is non-zero", async () => {
      // Given
      const appId = "some-app-id";

      // When
      when(runner.run).calledWith("dapp-stats", appId).mockResolvedValue({
        status: 2,
        stdout: "",
      });

      const adapter = CliAdapter(config, logger, runner);

      // Then
      await expect(adapter.stats(appId)).rejects.toThrow(
        "The stats command failed to execute, stats are not available"
      );
    });
  });
});
