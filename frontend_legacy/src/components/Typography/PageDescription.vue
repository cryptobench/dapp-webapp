<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "PageDescription",
});
</script>

<template>
  <div class="text-golem-code q-pa-lg golem-page-description">
    <slot />
  </div>
</template>

<style lang="sass">
.golem-page-description
  font-size: 1.1em
  line-height: 1.6em
  font-weight: 300
</style>
