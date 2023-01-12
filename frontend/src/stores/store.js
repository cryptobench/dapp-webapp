import { defineStore } from "pinia";
import { api } from "boot/axios";

export const useDappstoreStore = defineStore("store", {
  state: () => ({
    dapps: [],
  }),

  actions: {
    async getDapps() {
      this.dapps = await api.get("/store/dapps/");
    },
    async globalLimitCheck() {
      return await api.get("/quote/status/global");
    },
  },
});
