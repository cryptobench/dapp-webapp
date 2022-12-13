<template>
  <q-page class="q-pa-lg">
    <div class="text-primary text-h3 text-weight-bold q-pa-lg">My Dapps</div>
    <div class="text-body1 text-golem-code q-pa-lg">
      Your list of current and running applications hosted on the Golem Network
    </div>
    <q-separator inset class="q-ma-lg"/>
    <q-table
      flat
      id="dapp-instance-list"
      class="q-ma-md bg-golem"
      :rows="rows"
      :columns="columns"
      :loading="loading"
      row-key="id"
      rows-per-page-label="Dapps per page:"
      :rows-per-page-options="[10, 20, 0]"
      hide-header
      hide-bottom
    >
      <template v-slot:body-cell-icon="props">
        <q-td :props="props">
          <div class="image-cropper">
            <img
              :src="props.row.image"
              :alt="props.row.name"
              class="dapp-thumbnail"
            />
          </div>
        </q-td>
      </template>
      <template v-slot:body-cell-name="props">
        <q-td :props="props">
          <div class="dapp-td-title">{{ props.row.name }}</div>
          <div class="text-golem-gray">
            {{ new Date(Date.parse(props.row.created_at)).toLocaleString() }}
          </div>
        </q-td>
      </template>
      <template v-slot:body-cell-id="props">
        <q-td :props="props">
          <div class="dapp-td-title">
            App ID
            <q-btn
              flat
              unelevated
              dense
              size="sm"
              icon="content_copy"
              @click="copyToClipboard(props.row.id)"
            />
          </div>
          <div class="text-golem-gray">{{ props.row.id }}</div>
        </q-td>
      </template>
      <template v-slot:body-cell-status="props">
        <q-td :props="props">
          <q-badge
            :color="statusColor(props.row.status)"
            :label="props.row.status ?? 'Unknown'"
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
          />
          <q-btn
            flat
            square
            unelevated
            no-caps
            color="primary"
            label="Details"
            :to="/details/ + props.row.id"
          />
          <q-btn
            v-if="props.row.status === 'dead'"
            flat
            square
            unelevated
            no-caps
            color="negative"
            label="Delete"
            @click="deleteApp(props.row.id)"
          />
        </q-td>
      </template>
    </q-table>
  </q-page>
</template>

<script>
import { computed, defineComponent, ref } from "vue";
import { useDappsStore } from "stores/dapps";
import { useQuasar } from "quasar";

const columns = [
  {
    name: "icon",
    label: "Icon",
    align: "right",
    sortable: false,
  },
  {
    name: "name",
    label: "Name",
    align: "left",
    sortable: true,
  },
  {name: "id", align: "left", label: "App ID", field: "id", sortable: true},
  {
    name: "status",
    label: "Status",
    align: "left",
    sortable: true,
  },
  { name: "actions", label: "Actions", field: "actions", sortable: false },
];

export default defineComponent({
  name: "DappsPage",

  setup() {
    const $q = useQuasar();
    const dappStore = useDappsStore();

    const loading = ref(true);
    const stopping = ref(null);

    const rows = computed(() => dappStore.dapps);

    dappStore
      .getDapps()
      .then(() => {
        loading.value = false;
      })
      .catch((err) => {
        $q.notify({
          type: "negative",
          message: `There was an issue while obtaining list of dapps ${err}`,
        });
      })
      .finally(() => {
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
          message: `Started app ${id}`,
        });
      },
      statusColor: (status) => {
        if (status === "active") return "positive";
        if (status === "unknown_app") return "warning";
        if (status === "dead") return "negative";
        return "primary";
      },
      copyToClipboard: (id) => {
        navigator.clipboard.writeText(id);
        $q.notify({
          message: `Copied the dapp ID to clipboard`,
          timeout: 1000,
        });
      },
      deleteApp: (id) => {
        confirm(`This will delete the app ${id} - wish to continue?`);
      },
    };
  },
});
</script>
<style lang="sass">
.dapp-status
  font-size: 0.9em
  padding: 4px 8px
  min-width: 60px
  justify-content: center

.dapp-td-title
  font-weight: bold
  font-size: 1.2em
  color: #121212

.dapp-thumbnail
  display: inline
  margin: 0 auto
  margin-left: -25% //centers the image
  height: 100%
  width: auto

.image-cropper
  width: 40px
  height: 40px
  position: relative
  overflow: hidden
  border-radius: 50%

#dapp-instance-list td
  padding: 20px
</style>
