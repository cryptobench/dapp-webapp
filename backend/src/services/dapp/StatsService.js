const { Ok } = require("../../utils/Result");

module.exports = function StatsService({ dappService, storeService }) {
  async function getStatsForInstance(userId, instanceId) {
    const appInstance = await dappService.getInstanceInfo(userId, instanceId);
    const appInformation = storeService.getAppById(appInstance.payload.appStoreId);
    const size = await dappService.getAppImageSizes(appInformation.payload.descriptorPath);
    const general = await dappService.getStats(userId, instanceId);

    return Ok({
      general: general.payload,
      size: size.payload,
    });
  }

  return {
    getStatsForInstance,
  };
};
