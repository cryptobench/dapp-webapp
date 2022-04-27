<template>
  <div class="text-center q-pa-md flex flex-center">
    <div>
      <div style="font-size: 20vh">404</div>

      <div class="text-h2" style="opacity: 0.4">Oops. Nothing here...</div>

      <q-btn color="primary" class="q-mt-xl" to="/" label="Go Home" />
    </div>
  </div>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "ErrorNotFound",
});
</script>
