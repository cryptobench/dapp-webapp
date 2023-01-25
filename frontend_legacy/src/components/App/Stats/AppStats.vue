<script>
import { defineComponent, ref } from "vue";
import AppStatList from "components/App/Stats/AppStatList.vue";
import AppStatCard from "components/App/Stats/AppStatCard.vue";
import { api } from "boot/axios";
import { useQuasar } from "quasar";
import AlertNegative from "components/Alert/AlertNegative.vue";
import AppImageSizeCard from "components/App/Stats/AppImageSizeCard.vue";

export default defineComponent({
  name: "AppStats",
  components: { AlertNegative, AppStatCard, AppStatList, AppImageSizeCard },
  props: {
    app: {
      type: Object,
      required: true,
    },
  },
  async setup(props) {
    const $q = useQuasar();

    const error = ref(null);

    try {
      const stats = await api.get(`/dapp/${props.app.id}/stats`);

      return {
        stats,
      };
    } catch (err) {
      $q.notify({
        type: "negative",
        message: `Issue while obtaining stats: ${err}`,
      });

      error.value = err;

      return {
        error,
      };
    }
  },
});
</script>

<template>
  <div class="row justify-between">
    <div class="col-xs-12 col-lg-6 q-pa-sm">
      <AppStatCard v-if="stats.general" :stats="stats.general.app">
        <q-icon name="summarize" color="primary" />
        Summarised application stats
      </AppStatCard>
    </div>
    <div class="col-xs-12 col-lg-6 q-pa-sm">
      <AppImageSizeCard v-if="stats.size" class="col-6" :stats="stats.size" />
    </div>
    <div
      v-for="[nodeType, nodeInstances] in Object.entries(stats.general.nodes)"
      :key="nodeType"
      class="col-xs-12 col-lg-6 q-pa-sm"
    >
      <AppStatList :instances="nodeInstances" :type="nodeType" />
    </div>
    <AlertNegative v-if="error">Failed to load the app stats :(</AlertNegative>
  </div>
</template>
