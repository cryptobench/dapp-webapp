<template>
  <q-page class="q-pa-lg">
    <PageTitle value="My dApps" />
    <PageDescription>
      Your list of current and running applications hosted on the Golem Network
    </PageDescription>
    <q-separator inset class="q-ma-lg" />
    <q-inner-loading :showing="loading" label="Please wait..." />
    <q-table
      v-if="rows.length !== 0"
      id="dapp-instance-list"
      flat
      class="q-ma-md bg-golem"
      :rows="rows"
      :columns="columns"
      :loading="loading"
      row-key="id"
      rows-per-page-label="Entries per page:"
      :rows-per-page-options="[10, 20, 0]"
      hide-header
      hide-bottom
    >
      <template #body-cell-icon="props">
        <q-td :props="props">
          <AppCoverCircle :src="props.row.image" :alt="props.row.name" />
        </q-td>
      </template>
      <template #body-cell-name="props">
        <q-td :props="props">
          <AppProperty
            :name="props.row.name"
            :value="new Date(Date.parse(props.row.created_at)).toLocaleString()"
          />
        </q-td>
      </template>
      <template #body-cell-id="props">
        <q-td :props="props">
          <AppProperty name="App ID" :value="props.row.id" copy />
        </q-td>
      </template>
      <template #body-cell-status="props">
        <q-td :props="props">
          <AppStatusBadge :status="props.row.status" />
        </q-td>
      </template>
      <template #body-cell-actions="props">
        <q-td :props="props" class="q-gutter-x-md">
          <q-btn
            flat
            square
            unelevated
            no-caps
            color="primary"
            icon="manage_search"
            title="Details"
            :to="/details/ + props.row.id"
          />
          <q-btn
            v-if="props.row.status === 'active'"
            flat
            square
            unelevated
            no-caps
            color="warning"
            title="Stop"
            :loading="stopping === props.row.id"
            icon="stop"
            @click="stop(props.row.id)"
          />
          <q-btn
            v-if="props.row.status === 'dead'"
            flat
            square
            unelevated
            no-caps
            color="negative"
            title="Delete"
            icon="delete_forever"
            @click="deleteApp(props.row.id)"
          />
        </q-td>
      </template>
    </q-table>
    <q-card
      v-if="!loading && rows.length === 0"
      class="q-pa-xl"
      flat
      unelevated
    >
      You didn't run any dApps yet. <a href="#/store">Check the store</a>, to
      find some dApps to try!
    </q-card>
  </q-page>
</template>

<script>
import { computed, defineComponent, ref } from "vue";
import { useDappsStore } from "stores/dapps";
import { useQuasar } from "quasar";
import AppStatusBadge from "components/App/AppStatusBadge.vue";
import PageTitle from "components/Typography/PageTitle.vue";
import PageDescription from "components/Typography/PageDescription.vue";
import AppCoverCircle from "components/App/AppCoverCircle.vue";
import AppProperty from "components/App/AppProperty.vue";

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
  { name: "id", align: "left", label: "App ID", field: "id", sortable: true },
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
  components: {
    AppProperty,
    AppCoverCircle,
    PageDescription,
    PageTitle,
    AppStatusBadge,
  },

  setup() {
    const $q = useQuasar();
    const dappStore = useDappsStore();

    const loading = ref(true);
    const stopping = ref(null);

    const rows = computed(() => dappStore.dapps);

    dappStore
      .getDapps()
      .catch((err) => {
        $q.notify({
          type: "negative",
          message: `There was an issue while obtaining list of dApps ${err}`,
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
                textColor: "black",
                message: `dApp ${name} has been successfully stopped`,
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
      deleteApp: async (id) => {
        $q.dialog({
          title: "Delete dApp instance",
          message: `This will delete the app ${id} - wish to continue?`,
          cancel: {
            flat: true,
            square: true,
            unelevated: true,
            color: "primary",
          },
          ok: {
            label: "Delete",
            color: "negative",
            flat: true,
            square: true,
            unelevated: true,
          },
        })
          .onOk(async () => {
            try {
              await dappStore.deleteDapp(id);
              $q.notify({
                type: "positive",
                textColor: "black",
                message: `dApp instance ${id} has been deleted`,
              });
            } catch (err) {
              $q.notify({
                type: "negative",
                message: `Deleting dApp instance ${id} failed due to ${err}`,
              });
            }
          })
          .onCancel(() => {})
          .onDismiss(() => {});
      },
    };
  },
});
</script>
<style lang="sass">
.dapp-td-title
  font-weight: bold
  font-size: 1.2em
  color: #121212

#dapp-instance-list td
  padding: 20px
</style>
