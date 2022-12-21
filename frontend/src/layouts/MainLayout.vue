<template>
  <q-layout view="hhh LpR fFf">
    <q-header class="bg-golem text-black">
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
      show-if-above
      v-model="drawer"
      side="left"
      :mini="miniState"
      :width="200"
      :breakpoint="500"
    >
      <q-scroll-area class="fit">
        <q-list padding>
          <q-item clickable v-ripple to="/store">
            <q-item-section avatar>
              <q-icon name="store" />
            </q-item-section>
            <q-item-section>dApp Store</q-item-section>
          </q-item>

          <q-item clickable v-ripple to="/dapps">
            <q-item-section avatar>
              <q-icon name="apps" />
            </q-item-section>
            <q-item-section>My dApps</q-item-section>
          </q-item>
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

    <q-page-container class="bg-golem">
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { ref } from "vue";
import { useUserStore } from "stores/user";

export default {
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
