<script>
import { defineComponent } from "vue";

import { useQuasar } from "quasar";

export default defineComponent({
  name: "AppInstanceId",
  props: {
    id: {
      type: String,
      required: true,
    },
  },
  setup() {
    const $q = useQuasar();

    return {
      copyToClipboard: (id) => {
        navigator.clipboard.writeText(id);
        $q.notify({
          message: `Copied the dApp ID to clipboard`,
          timeout: 1000,
        });
      },
    };
  },
});
</script>

<template>
  <div class="dapp-td-title">
    App ID
    <q-btn
      v-if="id"
      flat
      unelevated
      dense
      size="sm"
      icon="content_copy"
      @click="copyToClipboard(id)"
    />
  </div>
  <div class="text-golem-gray">{{ id }}</div>
</template>
