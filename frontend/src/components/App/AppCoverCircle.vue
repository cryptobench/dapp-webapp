<template>
  <div class="image-cropper">
    <img :src="src" :alt="alt" class="dapp-thumbnail" />
  </div>
</template>
<script>
export default {
  name: "AppCoverCircle",
  props: {
    src: {
      type: String,
      required: true,
    },
    alt: {
      type: String,
      required: true,
    },
  },
};
</script>

<style lang="sass">
.dapp-thumbnail
  display: inline
  margin: 0 auto
  margin-left: -25% // centers the image
  height: 100%
  width: auto

.image-cropper
  width: 40px
  height: 40px
  position: relative
  overflow: hidden
  border-radius: 50%
</style>
