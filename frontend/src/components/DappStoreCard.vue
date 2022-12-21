<template>
  <q-card class="dapp-card q-ma-lg custom-shadow custom-border">
    <q-img :src="image" fit="cover" style="height: 200px" />
    <q-card-section class="flex">
      <q-item-section>
        <div
          class="text-subtitle2 dapp-author text-golem-code text-weight-bold q-ma-md"
        >
          By: {{ author }}
        </div>
        <div class="text-h5 text-weight-bold dapp-name q-ma-md">
          {{ name }}
        </div>
      </q-item-section>
    </q-card-section>
    <q-card-section>
      <div class="q-px-md text-golem-code">
        {{ description }}
      </div>
    </q-card-section>
    <q-card-actions align="right" class="no-border q-mt-auto">
      <q-btn
        square
        unelevated
        no-caps
        label="Run"
        icon-right="play_circle_outline"
        color="primary"
        class="q-ma-md text-weight-bold"
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
    image: {
      type: String,
      default: "https://cdn.quasar.dev/img/mountains.jpg",
    },
  },
  setup() {
    const dappStore = useDappsStore();
    const $q = useQuasar();

    function run(appId, name) {
      $q.dialog({
        title: name,
        message: `Would you like to run "${name}" on the Golem Network?`,
        cancel: {
          flat: true,
          square: true,
          unelevated: true,
          color: "secondary",
        },
        ok: {
          flat: true,
          label: "Yes",
          color: "primary",
          square: true,
          unelevated: true,
        },
      })
        .onOk(() => {
          dappStore.startDapp(appId).then((instanceId) => {
            if (instanceId) {
              $q.notify({
                type: "positive",
                textColor: "black",
                message: `dApp ${name} has been launched successfully`,
                actions: [
                  {
                    label: "Go to app",
                    color: "primary",
                    square: true,
                    unelevated: true,
                    to: `details/${instanceId}`,
                  },
                ],
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
  max-width: 350px

.dapp-author
  color: #49536A
  text-transform: uppercase

.dapp-name
  color: $primary

.custom-shadow
  box-shadow: 0px 0px 50px #eeeeee

.custom-border
  border-radius: 10px
</style>
