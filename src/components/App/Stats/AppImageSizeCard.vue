<template>
  <q-card flat unelevated>
    <q-card-section>
      <div class="text-h6">
        <q-icon name="scale" color="primary" />
        Image size information
      </div>
    </q-card-section>
    <q-markup-table>
      <tbody>
        <tr>
          <td>Total size of application images</td>
          <td>{{ bytesToMb(stats.total_size) }} MB</td>
        </tr>
        <tr v-for="[name, size] of Object.entries(stats.payloads)" :key="name">
          <td>Payload: {{ name }}</td>
          <td>{{ bytesToMb(size) }} MB</td>
        </tr>
      </tbody>
    </q-markup-table>
  </q-card>
</template>

<script>
export default {
  name: "AppImageSizeCard",
  props: {
    stats: {
      type: Object,
      required: true,
    },
  },
  setup() {
    return {
      bytesToMb(bytes) {
        return (bytes / 1024 / 1024).toFixed(2);
      },
    };
  },
};
</script>
