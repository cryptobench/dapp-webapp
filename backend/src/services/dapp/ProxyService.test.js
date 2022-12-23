const ProxyService = require("./ProxyService");
const { when } = require("jest-when");

const config = {
  proxy: {
    openPortTimeout: 3600,
    checkPortInterval: 1000,
    checkPortAttempts: 30,
    baseUrl: "http://test-domain.golem.network/app/",
  },
};

const redisClient = {
  get: jest.fn(),
  rPush: jest.fn(),
  del: jest.fn(),
};

const logger = {
  debug: jest.fn(),
};

describe("Proxy Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  test("Generates proxy URLs using the baseUrl provided in the configuration", async () => {
    const service = ProxyService({
      redisClient,
      logger,
      config,
    });

    // Given
    const appId = "testAppId";
    when(redisClient.get).calledWith("port.8080").mockResolvedValue(undefined);
    when(redisClient.get).calledWith("port-ready.8080").mockResolvedValue(appId);
    when(redisClient.rPush).calledWith("gpm", `open ${appId} 8080 3600`).mockResolvedValue(1);

    // When
    const result = await service.getProxyUrl(appId, 8080);

    // Then
    expect(result.payload.proxyUrl).toEqual("http://test-domain.golem.network/app/testAppId");
  });
});
