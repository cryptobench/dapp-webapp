<template>
  <q-layout view="hHh lpR fFf">
    <q-header reveal bordered class="bg-primary text-white">
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
        <q-toolbar-title>Golem Dapps</q-toolbar-title>
        <q-avatar>
          <img src="~assets/Golem.GLM_token_mark_RGB_Negative_RGB.svg" />
        </q-avatar>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="drawer"
      show-if-above
      :mini="miniState"
      :width="200"
      :breakpoint="500"
      bordered
      class="bg-grey-3"
    >
      <q-scroll-area class="fit">
        <q-list padding>
          <q-item clickable v-ripple to="/store">
            <q-item-section avatar>
              <q-icon name="store" />
            </q-item-section>
            <q-item-section> Dapp Store </q-item-section>
          </q-item>

          <q-item clickable v-ripple to="/dapps">
            <q-item-section avatar>
              <q-icon name="apps" />
            </q-item-section>
            <q-item-section> My Dapps </q-item-section>
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

    <q-page-container>
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
