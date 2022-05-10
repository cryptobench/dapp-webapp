<template>
  <q-page class="q-pa-lg">
    <h4 class="q-ma-md q-pb-lg">My dapps</h4>
    <q-table
      class="q-ma-md"
      :rows="rows"
      :columns="columns"
      :loading="loading"
      row-key="id"
      table-class="dapps-table"
      table-header-class="bg-secondary text-white"
      rows-per-page-label="Dapps per page:"
      :rows-per-page-options="[10, 20, 0]"
    >
      <template v-slot:body-cell-index="props">
        <q-td :props="props">
          {{ props.rowIndex + 1 }}
        </q-td>
      </template>
      <template v-slot:body-cell-status="props">
        <q-td :props="props">
          <q-badge
            :color="statusColor(props.value)"
            :label="props.value"
            class="dapp-status"
          />
        </q-td>
      </template>
      <template v-slot:body-cell-actions="props">
        <q-td :props="props" class="q-gutter-x-md">
          <q-btn
            rounded
            outline
            v-if="props.row.status === 'active'"
            size="sm"
            color="negative"
            label="stop"
            :loading="stopping === props.row.id"
            icon="highlight_off"
            style="min-width: 90px"
            @click="stop(props.row.id)"
          ></q-btn>
          <q-btn
            rounded
            outline
            size="sm"
            color="secondary"
            label="details"
            icon="preview"
            :to="/details/ + props.row.id"
          ></q-btn>
        </q-td>
      </template>
    </q-table>
  </q-page>
</template>

<script>
import { defineComponent, ref, computed } from "vue";
import { useDappsStore } from "stores/dapps";
import { useQuasar } from "quasar";
const columns = [
  { name: "index", label: "#", align: "left", field: "index", sortable: false },
  {
    name: "name",
    label: "Name",
    align: "left",
    sortable: true,
    field: "name",
    style: "font-weight: 500",
  },
  { name: "id", align: "left", label: "App ID", field: "id", sortable: true },
  {
    name: "created_at",
    label: "Starting Time",
    field: "created_at",
    align: "left",
    sortable: true,
    format: (val) => new Date(val).toLocaleString(),
    sort: (a, b) => (new Date(a).valueOf() > new Date(b).valueOf() ? 1 : -1),
  },
  {
    name: "status",
    label: "Status",
    field: "status",
    align: "left",
    sortable: true,
  },
  { name: "actions", label: "Actions", field: "actions" },
];
export default defineComponent({
  name: "DappsPage",

  setup() {
    const $q = useQuasar();
    const dappStore = useDappsStore();
    const loading = ref(true);
    const stopping = ref(null);
    const rows = computed(() => dappStore.dapps);
    dappStore.getDapps().then(() => {
      loading.value = false;
    });

    return {
      loading,
      stopping,
      columns,
      rows,
      stop: (id) => {
        stopping.value = id;
        dappStore
          .stopDapp(id)
          .then((result) => {
            if (result) {
              $q.notify({
                type: "positive",
                message: `Dapp ${name} has been successfully stopped`,
              });
            } else {
              $q.notify({
                type: "negative",
                message: `Some errors occurred while stopping ${name}`,
              });
            }
            stopping.value = null;
            dappStore.getDapps().then(() => {
              loading.value = false;
            });
          })
          .catch(() => {
            stopping.value = null;
          });
      },
      start: (id) => {
        $q.notify({
          type: "warning",
          message: `TODO ???`,
        });
      },
      statusColor: (status) => {
        if (status === "active") return "positive";
        if (status === "stopped") return "warning";
        if (status === "dead") return "negative";
        return "primary";
      },
    };
  },
});
</script>
<style lang="sass">
.dapps-table .q-table
  th, tbody td
    font-size: 1.0em
    line-height: 3em
.dapp-status
  font-size: 0.9em
  padding: 4px 8px
  min-width: 60px
  justify-content: center
</style>
