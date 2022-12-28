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
    square
    flat
    unelevated
  />
</template>
