<script>
import { defineComponent } from "vue";
import AppStatList from "components/App/AppStatList.vue";
import AppStatCard from "components/App/AppStatCard.vue";

export default defineComponent({
  name: "AppStats",
  components: { AppStatCard, AppStatList },
  props: {
    app: {
      type: Object,
      required: true,
    },
  },
  setup() {
    const EXAMPLE = {
      app: {
        state_changes: 3,
        launched_successfully: true,
        estimated_time_to_launch: "0:02:00",
        estimated_working_time: "0:02:00",
      },
      nodes: {
        db: {
          0: {
            state_changes: 3,
            launched_successfully: true,
            estimated_time_to_launch: "0:02:00",
            estimated_working_time: "0:02:00",
          },
        },
        http: {
          0: {
            state_changes: 3,
            launched_successfully: true,
            estimated_time_to_launch: "0:02:00",
            estimated_working_time: "0:02:00",
          },
        },
      },
    };

    return {
      appStats: EXAMPLE.app,
      nodeStats: EXAMPLE.nodes,
    };
  },
});
</script>

<template>
  <div class="col">
    <AppStatCard :stats="appStats">Summarised application stats</AppStatCard>
    <AppStatList
      v-for="[nodeType, nodeInstances] in Object.entries(nodeStats)"
      :key="nodeType"
      :instances="nodeInstances"
      :type="nodeType"
    />
  </div>
</template>
