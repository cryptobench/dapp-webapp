<script>
import { defineComponent } from "vue";

import { useQuasar } from "quasar";

export default defineComponent({
  name: "AppProperty",
  props: {
    name: {
      type: String,
      required: true,
    },
    value: {
      type: String,
      default: "",
    },
    copy: {
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    const $q = useQuasar();

    return {
      copyToClipboard: (value) => {
        navigator.clipboard.writeText(value);
        $q.notify({
          message: `Copied "${props.name}" to clipboard`,
          timeout: 1000,
        });
      },
    };
  },
});
</script>

<template>
  <div class="q-mb-md">
    <div class="app-property-name text-primary">
      {{ name }}
      <q-btn
        v-if="copy"
        flat
        unelevated
        dense
        size="sm"
        icon="content_copy"
        @click="copyToClipboard(value)"
      />
    </div>
    <div class="text-golem-gray">
      <slot>
        {{ value }}
      </slot>
    </div>
  </div>
</template>

<style lang="sass">
.app-property-name
  font-weight: bold
  font-size: 1.2em
  color: #121212
</style>
