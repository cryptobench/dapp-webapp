import { defineStore } from "pinia";
import { api } from "boot/axios";
import { useUserStore } from "stores/user";

const userStore = useUserStore();

export const useDappsStore = defineStore("dapps", {
  state: () => ({
    dapps: [],
    stateData: "",
    rawData: "",
    running: false,
  }),

  getters: {
    getDapp: (state) => {
      return (id) => state.dapps.find((dapp) => dapp.id === id);
    },
  },

  actions: {
    async getDapps() {
      this.dapps = await api.get(`/dapps/`);
    },
    async startDapp(appStoreId) {
      const id = await api.post(`/dapp/start/`, { appStoreId });
      return !!id;
    },
    async stopDapp(appId) {
      const id = await api.post(`/dapp/stop/`, { appId });
      return !!id;
    },
    async killDapp(appId) {
      const id = await api.post(`/dapp/kill/`, { appId });
      return !!id;
    },
    async startGettingData(id) {
      this.running = true;
      this.statusData = "";
      this.rawData = "";
      const start = async () => {
        this.stateData = await api.get(`/dapp/rawState/${id}`);
        this.rawData = await api.get(`/dapp/rawData/${id}`);
        if (this.running) setTimeout(async () => await start(), 1000);
      };
      start();
    },
    stopGettingData() {
      this.running = false;
    },
  },
});
