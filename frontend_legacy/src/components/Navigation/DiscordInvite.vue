<script>
import { defineComponent } from "vue";

export default defineComponent({
  setup() {
    return {
      redirectToDiscordChannel: () => {
        window.open(process.env.DISCORD_URL, "_blank");
      },
    };
  },
});
</script>

<template>
  <q-item v-ripple clickable @click="redirectToDiscordChannel">
    <q-item-section avatar>
      <q-icon name="discord" />
    </q-item-section>
    <q-item-section>Support</q-item-section>
  </q-item>
</template>
