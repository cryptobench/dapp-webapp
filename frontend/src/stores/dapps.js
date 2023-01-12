import { defineStore } from "pinia";
import { api } from "boot/axios";
import retry from "async-retry";
import { extractLinkFromAppData } from "src/lib/extractLinkFromAppData";

export const useDappsStore = defineStore("dapps", {
  state: () => ({
    dapps: [],
    stateData: {},
    rawData: {},
    stdout: {},
    stderr: {},
    log: {},
    link: {},
    running: {},
    proxyUrl: {},
    descriptor: {},
    timers: {},
  }),

  getters: {
    getDapp: (state) => (id) => state.dapps.find((dapp) => dapp.id === id),
    getStateData: (state) => (id) => state.stateData?.[id],
    getRawData: (state) => (id) => state.rawData?.[id],
    getStdout: (state) => (id) => state.stdout?.[id],
    getStderr: (state) => (id) => state.stderr?.[id],
    getLog: (state) => (id) => state.log?.[id],
    getLink: (state) => (id) => state.link?.[id],
    getProxyUrl: (state) => (id) => state.proxyUrl?.[id],
    getDescriptor: (state) => (id) => state.descriptor?.[id],
  },

  actions: {
    async getDapps() {
      this.dapps = await api.get(`/dapps/`);
    },
    async startDapp(appStoreId) {
      return api.post(`/dapp/start/`, { appStoreId });
    },
    async stopDapp(appId) {
      const id = await api.post(`/dapp/stop/`, { appId });
      return !!id;
    },
    async deleteDapp(appId) {
      const deletedId = await api.delete(`/dapps/${appId}`);

      this.dapps = this.dapps.filter((dapp) => dapp.id !== deletedId);

      return deletedId;
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
      this.descriptor[id] = await api.get(`/dapp/${id}/descriptor`);
    },
    async setupLink(id) {
      const link = extractLinkFromAppData(this.rawData[id]);

      if (link !== this.link[id]) {
        this.link[id] = link;

        if (this.link[id].length) {
          await this.fetchProxyUrl(id, link);
        }
      }
    },
    fetchProxyUrl(id, local_proxy_address) {
      const port = local_proxy_address.substr(
        local_proxy_address.indexOf(":", 5) + 1
      );

      return retry(
        async () => {
          const response = await api.get(`/dapp/proxyUrl/${id}/${port}`);
          this.proxyUrl[id] = response?.proxyUrl || "";
        },
        { retries: 30 }
      );
    },
    async startGettingData(id) {
      this.running[id] = true;
      this.timers[id] = setInterval(async () => {
        await this.getData(id);
        const info = this.getDapp(id);
        if (info?.status === "active") {
          await this.setupLink(id);
        }
      }, 5000);
    },
    stopGettingData(id) {
      clearInterval(this.timers[id]);
      this.running[id] = false;
    },
  },
});
