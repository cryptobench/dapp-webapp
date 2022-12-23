<script>
import { defineComponent } from "vue";
import AppStatCard from "components/App/AppStatCard.vue";

export default defineComponent({
  name: "AppStatList",
  components: { AppStatCard },
  props: {
    instances: {
      type: Object,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
  },
  setup() {
    return {};
  },
});
</script>
<template>
  <AppStatCard
    v-for="[instanceKey, stats] in Object.entries(instances)"
    :key="instanceKey"
    :stats="stats"
    class="q-my-lg"
    flat
    unelevated
  >
    Stats for "{{ type }}-{{ instanceKey }}"
  </AppStatCard>
</template>
