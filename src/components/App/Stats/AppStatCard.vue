<template>
  <q-card flat unelevated>
    <q-card-section>
      <div class="text-h6">
        <slot />
      </div>
    </q-card-section>
    <q-markup-table>
      <tbody>
        <tr>
          <td>Number of state changes</td>
          <td>{{ stats.state_changes }}</td>
        </tr>
        <tr>
          <td>Launched successfully</td>
          <td>{{ stats.launched_successfully ? "Yes" : "No" }}</td>
        </tr>
        <tr v-if="!!stats.time_to_launch">
          <td>Time to launch</td>
          <td>{{ stats.time_to_launch }}</td>
        </tr>
        <tr>
          <td>Terminated</td>
          <td>{{ stats.terminated ? "Yes" : "No" }}</td>
        </tr>
        <tr v-if="!!stats.working_time">
          <td>Working Time</td>
          <td>{{ stats.working_time }}</td>
        </tr>
      </tbody>
    </q-markup-table>
  </q-card>
</template>

<script>
export default {
  name: "AppStatCard",
  props: {
    stats: {
      type: Object,
      required: true,
    },
  },
};
</script>
