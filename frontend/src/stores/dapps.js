import { defineStore } from "pinia";
import { api } from "boot/axios";
import retry from "async-retry";

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
  },

  actions: {
    async getDapps() {
      this.dapps = await api.get(`/dapps/`);
    },
    /**
     *
     * @param {String} appStoreId The dApp ID to run
     *
     * @returns {Promise<string>} The dApp instance ID
     */
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
      await this.setupLink(id);
    },
    parseLinkFromRawData(rawData) {
      let link = "";
      rawData
        .split("\n")
        .filter((l) => l.trim())
        .forEach((line) => {
          try {
            let data = JSON.parse(line);
            link = data?.http?.local_proxy_address || "";
          } catch (error) {
            console.log("ERROR", error);
          }
        });
      return link;
    },
    async setupLink(id) {
      const link = this.parseLinkFromRawData(this.rawData[id]);
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
      const start = async () => {
        await this.getData(id);
        if (this.running?.[id]) setTimeout(async () => await start(), 5000);
      };
      start();
    },
    stopGettingData(id) {
      this.running[id] = false;
    },
  },
});
