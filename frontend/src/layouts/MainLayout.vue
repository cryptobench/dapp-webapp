<template>
  <q-layout view="hhh LpR fff">
    <q-header class="bg-golem text-black" reveal>
      <q-toolbar>
        <q-btn
          dense
          flat
          round
          icon="menu"
          @click="
            $q.screen.lt.sm ? (drawer = !drawer) : (miniState = !miniState)
          "
        />

        <q-toolbar-title>
          <q-avatar class="q-mx-md">
            <img
              src="~assets/golem-network-tokens-glm-logo.svg"
              alt="Golem Logo"
            />
          </q-avatar>
          Golem Distributed Cloud
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="drawer"
      show-if-above
      side="left"
      :mini="miniState"
      :width="200"
      :breakpoint="500"
    >
      <q-scroll-area class="fit">
        <q-list padding>
          <q-item v-ripple clickable to="/store">
            <q-item-section avatar>
              <q-icon name="store" />
            </q-item-section>
            <q-item-section>dApp Store</q-item-section>
          </q-item>

          <q-item v-ripple clickable to="/dapps">
            <q-item-section avatar>
              <q-icon name="apps" />
            </q-item-section>
            <q-item-section>My dApps</q-item-section>
          </q-item>
          <DiscordInvite />
          <!--
          <q-item clickable v-ripple to="/payments">
            <q-item-section avatar>
              <q-icon name="payments" />
            </q-item-section>
            <q-item-section> Payments </q-item-section>
          </q-item>
-->
        </q-list>
      </q-scroll-area>
    </q-drawer>
    <q-footer class="bg-golem text-black">
      <div class="row">
        <div class="col-1"></div>
        <div
          class="col-2"
          style="font-size: 16px; margin-bottom: 10px; margin-top: 40px"
        >
          <b class="text-primary">LEGAL</b>
        </div>
        <div class="col-9"></div>
        <div class="col-1"></div>

        <div class="col-2" style="margin-bottom: 20px">
          <a class="footer-link golemgray" href="#/terms-and-conditions">
            Terms & conditions
          </a>
        </div>
      </div>
    </q-footer>
    <q-page-container class="bg-golem">
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { ref } from "vue";
import { useUserStore } from "stores/user";
import DiscordInvite from "components/Navigation/DiscordInvite.vue";
export default {
  components: { DiscordInvite },
  setup() {
    const miniState = ref(false);
    const drawer = ref(false);

    const userStore = useUserStore();

    if (!userStore.user) {
      userStore.register();
    }

    return {
      drawer,
      miniState,
    };
  },
};
</script>
<style lang="sass" scoped>
.footer-link
  text-decoration: none

.footer-link:hover
  text-decoration: underline

.golemgray
  color: #28293c
</style>
