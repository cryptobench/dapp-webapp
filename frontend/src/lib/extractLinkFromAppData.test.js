const { extractLinkFromAppData } = require("./extractLinkFromAppData");
describe("Link extraction", () => {
  test("Is able to extract a link from the application output, when it's reported by 'web' payload", () => {
    const rawData =
      '{}\n{"web": {"local_proxy_address": "http://localhost:8080"}}';

    const link = extractLinkFromAppData(rawData);

    expect(link).toEqual("http://localhost:8080");
  });

  test("Is able to extract a link from the application output, when it's reported by 'http' payload", () => {
    const rawData =
      '{}\n{"http": {"local_proxy_address": "http://localhost:8080"}}';

    const link = extractLinkFromAppData(rawData);

    expect(link).toEqual("http://localhost:8080");
  });
});
