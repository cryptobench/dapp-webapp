import { defineStore } from "pinia";
import { api } from "boot/axios";

export const useUsageQuotaStore = defineStore("usageQuotas", {
  state: () => {
    return {
      userActiveAppsLimitReached: false,
      globalActiveAppsLimitReached: false,
      userActiveAppsCount: 0,
      globalActiveAppsCount: 0,
    };
  },
  actions: {
    async getQuotaLimits() {
      const limits = await api.get("/usage/limits");
      this.userActiveAppsLimitReached = limits.userActiveAppsLimitReached;
      this.globalActiveAppsLimitReached = limits.globalActiveAppsLimitReached;
      this.userActiveAppsCount = limits.userActiveAppsCount;
      this.globalActiveAppsCount = limits.globalActiveAppsCount;
      return limits;
    },
  },
});
