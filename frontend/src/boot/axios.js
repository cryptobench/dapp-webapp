import { boot } from "quasar/wrappers";
import axios from "axios";
import { Notify } from "quasar";
import { useUserStore } from "stores/user";
const api = axios.create({ baseURL: process.env.API_BACKEND_URL });

export default boot(({ app, store }) => {
  const userStore = useUserStore(store);

  const getOrCreateUserId = async () => {
    if (!userStore.user) {
      await userStore.register();
    }
    return userStore.user.id;
  };

  api.interceptors.request.use(
    async (config) => {
      const userId = await getOrCreateUserId();
      config.headers["Authorization"] = userId;
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
      } else if (response.data.error) {
        const { error } = response.data;
        console.error({ error }, "Backend request failed due to this error");
        Notify.create({
          type: "negative",
          message: error,
        });
      } else {
        console.error({ response }, "Unknown issue with the response");
      }
    },
    async (error) => {
      console.error({ error }, "Backend request failed due to this error");
      Notify.create({
        type: "negative",
        message:
          error.response?.data.error ||
          error?.toString() ||
          "Some error has occurred",
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
