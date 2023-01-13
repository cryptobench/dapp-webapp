import { defineStore } from "pinia";
import { api } from "boot/axios";

export const useUsageQuotesStore = defineStore("usagequotes", {
  state: () => {
    return {
      userActiveAppsLimitReached: false,
      globalActiveAppsLimitReached: false,
      userActiveAppsCount: 0,
      globalActiveAppsCount: 0,
    };
  },
  actions: {
    async getQuoteLimits() {
      const limits = await api.get("/usage/limits");
      this.userActiveAppsLimitReached = limits.userActiveAppsLimitReached;
      this.globalActiveAppsLimitReached = limits.globalActiveAppsLimitReached;
      this.userActiveAppsCount = limits.userActiveAppsCount;
      this.globalActiveAppsCount = limits.globalActiveAppsCount;
      return limits;
    },
  },
});
