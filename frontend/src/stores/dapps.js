import { defineStore } from "pinia";
import { api } from "boot/axios";

export const useDappsStore = defineStore("dapps", {
  state: () => ({
    dapps: [],
    stateData: "",
    rawData: "",
    stdout: "",
    stderr: "",
    log: "",
    link: "",
    proxyUrl: "",
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
      this.setupLink(id);
    },
    parseLinkFromRawData() {
      let link = "";
      this.rawData.split("\n").filter(l => l.trim()).forEach(line => {
        try {
          let data = JSON.parse(line);
          link = data?.http?.local_proxy_address || ""
        } catch (error) {
          console.log('ERROR', error)
        }
      });
      return link;
    },
    setupLink(id) {
      const link = this.parseLinkFromRawData(this.rawData);
      if(link !== this.link) {
        this.link = link;

        if(this.link.length) {
          this.getProxyUrl(id, link)
        }
      }
    },
    getProxyUrl(id, local_proxy_address) {
      const port = local_proxy_address.substr(local_proxy_address.indexOf(":",5)+1)
      api.get(`/dapp/proxyUrl/${id}/${port}`).then((response) => {
        this.proxyUrl = response?.proxyUrl || ""
      }).catch(() => {
        this.getProxyUrl(id, local_proxy_address)
      });
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
