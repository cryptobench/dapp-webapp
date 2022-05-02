import { defineStore } from "pinia";
import { LocalStorage } from "quasar";
import { mande, defaults } from "mande";
const userApi = mande("http://localhost:8200/user/register");

export const useUserStore = defineStore("user", {
  state: () => ({
    user: LocalStorage.getItem("user"),
  }),

  actions: {
    async register() {
      const { payload } = await userApi.post({});
      this.user = payload;
      defaults.headers.Authorization = this.user.id;
      LocalStorage.set("user", this.user);
    },
  },
});
