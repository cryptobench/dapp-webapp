import { boot } from "quasar/wrappers";
import axios from "axios";
import { Notify } from "quasar";
import { useUserStore } from "stores/user";

const api = axios.create({ baseURL: process.env.API_BACKEND_URL });

export default boot(({ app, store }) => {
  const userStore = useUserStore(store);

  api.interceptors.request.use(
    (config) => {
      config.headers["Authorization"] = userStore.user.id;
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  api.interceptors.response.use(
    async (response) => {
      if (response.data.success) {
        return response.data.payload;
      } else {
        Notify.create({
          type: "negative",
          message: response.data.error,
        });
      }
    },
    async (error) => {
      console.log({ error });
      Notify.create({
        type: "negative",
        message:
          error.response?.data.error ||
          error?.toString() ||
          "Some errors has occurred",
      });
      throw error.response;
    }
  );

  // for use inside Vue files (Options API) through this.$axios and this.$api

  app.config.globalProperties.$axios = axios;
  // ^ ^ ^ this will allow you to use this.$axios (for Vue Options API form)
  //       so you won't necessarily have to import axios in each vue file

  app.config.globalProperties.$api = api;
  // ^ ^ ^ this will allow you to use this.$api (for Vue Options API form)
  //       so you can easily perform requests against your app's API
});

export { axios, api };
