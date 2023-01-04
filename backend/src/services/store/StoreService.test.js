const StoreService = require("./StoreService");
const { when } = require("jest-when");

const database = {
  loadDescriptorForApp: jest.fn(),
};
describe("Store Service", () => {
  const service = StoreService({ database });

  describe("getDescriptorForApp - obtaining app descriptor", () => {
    test("Positive case where the descriptor is found and returned back", () => {
      // given
      const descriptor = { a: 1 };

      // when
      when(database.loadDescriptorForApp).calledWith("3").mockReturnValue(descriptor);
      const result = service.getDescriptorForApp("3");

      // then
      expect(result).toEqual({
        payload: descriptor,
        success: true,
      });
    });

    test("Negative case where there's an issue with obtaining the descriptor", () => {
      // given
      const internalError = new Error("Something went wrong internally");

      // when
      when(database.loadDescriptorForApp)
        .calledWith("no-chance-this-exists")
        .mockImplementationOnce(() => {
          throw internalError;
        });

      // then
      expect(() => service.getDescriptorForApp("no-chance-this-exists")).toThrow(internalError);
    });
  });
});
