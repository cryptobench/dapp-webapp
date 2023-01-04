<script>
export default {
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
};
</script>
<template>
  <q-btn
    no-caps
    :href="link"
    :label="link"
    target="_blank"
    icon="link"
    color="primary"
    :title="title"
    :loading="loading"
    square
    flat
    unelevated
  />
</template>
