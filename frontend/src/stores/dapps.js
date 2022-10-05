import { defineStore } from "pinia";
import { api } from "boot/axios";
import { useUserStore } from "stores/user";

const userStore = useUserStore();

export const useDappsStore = defineStore("dapps", {
  state: () => ({
    dapps: [],
    stateData: {},
    rawData: {},
    stdout: {},
    stderr: {},
    log: {},
    running: {},
  }),

  getters: {
    getDapp: (state) => (id) => state.dapps.find((dapp) => dapp.id === id),
    getStateData: (state) => (id) => state.stateData[id],
    getRawData: (state) => (id) => state.rawData[id],
    getStdout: (state) => (id) => state.stdout[id],
    getStderr: (state) => (id) => state.stderr[id],
    getLog: (state) => (id) => state.log[id],
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
    async getData(id) {
      this.stateData[id] = await api.get(`/dapp/rawState/${id}`);
      this.rawData[id] = await api.get(`/dapp/rawData/${id}`);
      this.stdout[id] = await api.get(`/dapp/stdout/${id}`);
      this.stderr[id] = await api.get(`/dapp/stderr/${id}`);
      this.log[id] = await api.get(`/dapp/log/${id}`);
    },
    async startGettingData(id) {
      this.running[id] = true;
      this.clearData(id);
      const start = async () => {
        await this.getData(id);
        if (this.running[id]) setTimeout(async () => await start(), 5000);
      };
      start();
    },
    stopGettingData(id) {
      this.clearData(id);
      this.running[id] = false;
    },
    clearData(id) {
      this.statusData?.[id] && (this.statusData[id] = "");
      this.rawData?.[id] && (this.rawData[id] = "");
      this.stdout?.[id] && (this.stdout[id] = "");
      this.stderr?.[id] && (this.stderr[id] = "");
      this.log?.[id] && (this.log[id] = "");
    },
  },
});
