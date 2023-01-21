<script>
import { defineComponent } from "vue";
import { useQuasar } from "quasar";

export default defineComponent({
  name: "AppLink",
  props: {
    link: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },
  setup() {
    const $q = useQuasar();

    return {
      copyToClipboard: (link) => {
        navigator.clipboard.writeText(link);
        $q.notify({
          message: `Copied the dApp link clipboard`,
          timeout: 1000,
        });
      },
    };
  },
});
</script>
<template>
  <q-btn-group>
    <q-btn
      :href="link"
      label="go"
      target="_blank"
      icon="open_in_new"
      color="primary"
      :title="title"
      :loading="loading"
      square
      unelevated
    />
    <!-- to avoid two loading spinners this one is not rendered when loading -->
    <q-btn
      v-if="!loading"
      label="copy"
      icon="content_copy"
      color="secondary"
      :title="title"
      square
      unelevated
      @click="copyToClipboard(link)"
    />
  </q-btn-group>
</template>
