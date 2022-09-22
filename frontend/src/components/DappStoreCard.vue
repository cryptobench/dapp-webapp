<template>
  <q-card class="dapp-card">
    <q-card-section class="bg-secondary text-white flex">
      <q-item-section>
        <div class="text-h6">{{ name }}</div>
        <div class="text-subtitle2">by {{ author }}</div>
      </q-item-section>
      <q-icon :name="icon" size="lg" />
    </q-card-section>
    <q-card-section class="description">
      {{ description }}
    </q-card-section>
    <q-card-actions vertical align="right">
      <q-btn
        flat
        label="RUN"
        icon="play_circle"
        color="secondary"
        @click="run(id, name)"
      ></q-btn>
    </q-card-actions>
  </q-card>
</template>

<script>
import { useQuasar } from "quasar";
import { useDappsStore } from "stores/dapps";

export default {
  name: "DappStoreCard",
  props: {
    id: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    author: {
      type: String,
      default: "Golem Factory",
    },
    icon: {
      type: String,
      default: "verified",
    },
  },
  setup() {
    const dappStore = useDappsStore();
    const $q = useQuasar();
    function run(id, name) {
      $q.dialog({
        title: name,
        message: `Would you like to run ${name} on the golem network?`,
        cancel: {
          color: "secondary",
          outline: true,
        },
        ok: {
          label: "Yes",
          color: "secondary",
        },
      })
        .onOk(() => {
          dappStore.startDapp(id).then((result) => {
            if (result) {
              $q.notify({
                type: "positive",
                message: `Dapp ${name} has been launched successfully`,
              });
            } else {
              $q.notify({
                type: "negative",
                message: `Some errors occurred while starting up ${name}`,
              });
            }
          });
        })
        .onCancel(() => {
          // console.log('Cancel')
        })
        .onDismiss(() => {
          // console.log('I am triggered on both OK and Cancel')
        });
    }
    return {
      run,
    };
  },
};
</script>
<style lang="sass" scoped>
.dapp-card
  width: 100%
  max-width: 350px
</style>
