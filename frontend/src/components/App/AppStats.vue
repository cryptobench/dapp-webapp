<script>
import { defineComponent } from "vue";
import AppStatList from "components/App/AppStatList.vue";
import AppStatCard from "components/App/AppStatCard.vue";
import { api } from "boot/axios";
import { useQuasar } from "quasar";

export default defineComponent({
  name: "AppStats",
  components: { AppStatCard, AppStatList },
  props: {
    app: {
      type: Object,
      required: true,
    },
  },
  async setup(props) {
    const $q = useQuasar();

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

      throw err;
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
  </div>
</template>
