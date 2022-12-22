<template>
  <q-page class="q-pa-lg">
    <PageTitle value="My dApps" />
    <PageDescription>
      Your list of current and running applications hosted on the Golem Network
    </PageDescription>
    <q-separator inset class="q-ma-lg" />
    <q-table
      id="dapp-instance-list"
      flat
      class="q-ma-md bg-golem"
      :rows="rows"
      :columns="columns"
      :loading="loading"
      row-key="id"
      rows-per-page-label="dApps per page:"
      :rows-per-page-options="[10, 20, 0]"
      hide-header
      hide-bottom
    >
      <template #body-cell-icon="props">
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
      <template #body-cell-name="props">
        <q-td :props="props">
          <div class="dapp-td-title">{{ props.row.name }}</div>
          <div class="text-golem-gray">
            {{ new Date(Date.parse(props.row.created_at)).toLocaleString() }}
          </div>
        </q-td>
      </template>
      <template #body-cell-id="props">
        <q-td :props="props">
          <AppInstanceId :id="props.row.id" />
        </q-td>
      </template>
      <template #body-cell-status="props">
        <q-td :props="props">
          <AppStatus :status="props.row.status" />
        </q-td>
      </template>
      <template #body-cell-actions="props">
        <q-td :props="props" class="q-gutter-x-md">
          <q-btn
            v-if="props.row.status === 'active'"
            flat
            square
            unelevated
            no-caps
            color="negative"
            label="Stop"
            :loading="stopping === props.row.id"
            icon="stop"
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
import AppStatus from "components/App/AppStatus.vue";
import AppInstanceId from "components/App/AppInstanceId.vue";
import PageTitle from "components/Typography/PageTitle.vue";
import PageDescription from "components/Typography/PageDescription.vue";

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
  components: { PageDescription, PageTitle, AppInstanceId, AppStatus },

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

.dapp-thumbnail
  display: inline
  margin: 0 auto
  margin-left: -25%
  //centers the image
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
