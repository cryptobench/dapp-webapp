import { defineStore } from "pinia";
import { api } from "boot/axios";
import retry from "async-retry";

import environment from "../utils/environment";

// console.log("prc", process.env);
export const useDappsStore = defineStore("dapps", {
  state: () => ({
    dapps: [],
    stateData: {},
    rawData: {},
    stdout: {},
    stderr: {},
    log: {},
    localUrl: {},
    running: {},
    proxyUrl: {},
    descriptor: {},
    timers: {},
    appUrl: {},
  }),

  getters: {
    getDapp: (state) => (id) => state.dapps.find((dapp) => dapp.id === id),
    getStateData: (state) => (id) => state.stateData?.[id],
    getRawData: (state) => (id) => state.rawData?.[id],
    getStdout: (state) => (id) => state.stdout?.[id],
    getStderr: (state) => (id) => state.stderr?.[id],
    getLog: (state) => (id) => state.log?.[id],
    getLocalUrl: (state) => (id) => {
      return state.localUrl[id];
    },
    getProxyUrl: (state) => (id) => {
      return state.proxyUrl[id];
    },
    getAppUrl: (state) => (id) => {
      return state.appUrl[id];
    },
    getDescriptor: (state) => (id) => state.descriptor?.[id],
  },

  actions: {
    //TODO : refactor this way of loading data immediatelly when we will get rid of vue
    // for now thats clearing interval it is safe but has to be refactored
    async getDapps() {
      clearInterval(this.timers["monitorDapps"]);
      const getDappsDelay = 1000;
      const that = this;
      this.timers["monitorDapps"] = setInterval(
        //immediately invoked setInmterval, now and then periodically
        //probably mroe clear with promise
        (function getDapps() {
          api.get(`/dapps/`).then((dapps) => {
            that.dapps = dapps;
          });
          return getDapps;
        })(),
        getDappsDelay
      );
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
    parseLinkFromRawData(rawData) {
      let link = "";
      rawData
        .split("\n")
        .map((l) => l.trim())
        .filter((l) => !!l)
        .forEach((line) => {
          try {
            const data = JSON.parse(line);
            link = data?.http?.local_proxy_address || "";
          } catch (error) {
            console.error("Error during obtaining local_proxy_address", error);
          }
        });
      return link;
    },
    async setupLink(id) {
      const localUrl = this.parseLinkFromRawData(this.rawData[id]);
      if (localUrl !== this.localUrl[id]) {
        this.localUrl[id] = localUrl;
      }

      // if proxy is in use then load, its unnecessary ping pong
      // and url should be obtained on one call to backend

      if (environment.isProxyInUse()) {
        const port = new URL(localUrl).port;
        if (port) {
          const url = await this.fetchProxyUrl({ id, port });
          this.appUrl[id] = url;
        }
      } else {
        this.appUrl[id] = localUrl;
      }
    },
    fetchProxyUrl({ id, port }) {
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
        await this.getDapps();
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
