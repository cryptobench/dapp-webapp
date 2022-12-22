<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "PageTitle",
  props: {
    value: {
      type: String,
      required: true,
    },
  },
});
</script>

<template>
  <div class="text-primary text-h3 text-weight-bold q-pa-lg">{{ value }}</div>
</template>
