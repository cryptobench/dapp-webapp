const StoreDatabase = require("./StoreDatabase");

const driver = {};
const logger = {};

describe("Store Database", () => {
  const db = StoreDatabase(driver, logger);

  describe("loadDescriptorForApp - loading descriptor for particular app", () => {
    test("Positive case where the descriptor is loaded correctly", () => {
      const result = db.loadDescriptorForApp("3");
      expect(result.meta.author).toEqual("Golem Factory");
    });

    test("Negative case when the app is not found at all", () => {
      expect(() => db.loadDescriptorForApp("no-chance-this-exists")).toThrow(
        "App with ID no-chance-this-exists does not exist!"
      );
    });
  });
});
