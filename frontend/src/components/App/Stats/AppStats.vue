<script>
import { defineComponent, ref } from "vue";
import AppStatList from "components/App/Stats/AppStatList.vue";
import AppStatCard from "components/App/Stats/AppStatCard.vue";
import { api } from "boot/axios";
import { useQuasar } from "quasar";
import AlertNegative from "components/Alert/AlertNegative.vue";

export default defineComponent({
  name: "AppStats",
  components: { AlertNegative, AppStatCard, AppStatList },
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
  <div class="col">
    <AppStatCard v-if="stats" :stats="stats.app">
      Summarised application stats
    </AppStatCard>
    <div v-if="stats">
      <AppStatList
        v-for="[nodeType, nodeInstances] in Object.entries(stats.nodes)"
        :key="nodeType"
        :instances="nodeInstances"
        :type="nodeType"
      />
    </div>
    <AlertNegative v-if="error">Failed to load the app stats :(</AlertNegative>
  </div>
</template>
