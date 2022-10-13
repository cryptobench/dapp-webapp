import { defineStore } from "pinia";
import { api } from "boot/axios";
import { useUserStore } from "stores/user";

const userStore = useUserStore();

export const useDappsStore = defineStore("dapps", {
  state: () => ({
    dapps: [],
    stateData: "",
    rawData: "",
    stdout: "",
    stderr: "",
    log: "",
    link: "",
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
    async getData(id) {
      this.stateData = await api.get(`/dapp/rawState/${id}`);
      this.rawData = await api.get(`/dapp/rawData/${id}`);
      this.stdout = await api.get(`/dapp/stdout/${id}`);
      this.stderr = await api.get(`/dapp/stderr/${id}`);
      this.log = await api.get(`/dapp/log/${id}`);
      this.link =this.getLink();
    },
    getLink() {
      let link = "";
      console.log('RAW', this.rawData)
        this.rawData.split("\n").every(line => {
          let data = {}
          try {
            data = JSON.parse(line);
          } catch (error) {
            return true;
          }
          for (const [_, val] of Object.entries(data)) {
            if (val.local_proxy_address) {
              link = val.local_proxy_address;
              return false;
            }
          }
          return true;
        });
      return link;
    },
    async startGettingData(id) {
      this.running = true;
      this.statusData = "";
      this.rawData = "";
      const start = async () => {
        await this.getData(id);
        if (this.running) setTimeout(async () => await start(), 5000);
      };
      start();
    },
    stopGettingData() {
      this.running = false;
    },
  },
});
