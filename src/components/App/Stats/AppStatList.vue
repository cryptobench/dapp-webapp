<script>
import { defineComponent } from "vue";
import AppStatCard from "components/App/Stats/AppStatCard.vue";

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
    flat
    unelevated
  >
    <q-icon name="account_tree" color="secondary" />
    Stats for "{{ type }}"
  </AppStatCard>
</template>
