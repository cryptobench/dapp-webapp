<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "AppStatusBadge",
  props: {
    status: {
      type: String,
      required: true,
    },
  },
  setup() {
    return {
      statusColor: (status) => {
        switch (status) {
          case "active":
            return "positive";
          case "unknown_app":
            return "warning";
          case "dead":
            return "negative";
          default:
            return "primary";
        }
      },
      statusTextColor: (status) => {
        switch (status) {
          case "active":
            return "black";
          default:
            return "white";
        }
      },
      statusText: (status) => {
        const parts = status.split("_");
        const result = parts.map(
          (word) => word.charAt(0).toUpperCase() + word.slice(1)
        );
        return result.join(" ");
      },
    };
  },
});
</script>

<template>
  <q-badge
    :color="statusColor(status)"
    :text-color="statusTextColor(status)"
    :label="statusText(status) ?? 'Unknown'"
    class="dapp-status"
  />
</template>

<style lang="sass">
.dapp-status
  font-size: 0.9em
  padding: 4px 8px
  min-width: 60px
  justify-content: center
</style>
