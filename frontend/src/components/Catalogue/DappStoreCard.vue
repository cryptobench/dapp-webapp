<template>
  <q-card class="dapp-card q-ma-lg q-pb-xl custom-shadow custom-border">
    <q-img :src="image" fit="cover" style="height: 200px" />
    <q-card-section class="flex">
      <q-item-section>
        <div class="text-golem-code text-weight-bold dapp-author q-ma-md">
          By: {{ author }}
        </div>
        <div class="text-h5 text-weight-bold dapp-name q-ma-md">
          {{ name }}
        </div>
      </q-item-section>
    </q-card-section>
    <q-card-section>
      <div class="q-px-md text-golem-code dapp-description q-mb-xl">
        {{ description }}
      </div>
    </q-card-section>
    <q-card-actions align="right" class="stick-bottom">
      <div class="q-ma-md">
        <q-tooltip v-if="quota.limited"> {{ quota.message }} </q-tooltip>
        <q-btn
          square
          unelevated
          no-caps
          label="Run"
          icon-right="play_circle_outline"
          color="primary"
          class="text-weight-bold"
          @click="run(id, name)"
          :disable="quota.limited"
        >
        </q-btn>
      </div>
    </q-card-actions>
  </q-card>
</template>

<script>
import { useQuasar } from "quasar";
import { useDappsStore } from "stores/dapps";
import { useRouter } from "vue-router";

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
    quota: {
      type: Object,
      required: true,
    },
  },
  setup() {
    const dappStore = useDappsStore();
    const $q = useQuasar();
    const $router = useRouter();

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
              });

              // Navigate user to the newly started app
              $router.push({
                path: `details/${instanceId}`,
              });
            } else {
              $q.notify({
                type: "negative",
                message: `Some errors occurred while starting up ${name}`,
              });
            }
          });
        })
        .onCancel(() => {})
        .onDismiss(() => {});
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
  font-size: 0.8em

.dapp-name
  color: $primary

.custom-shadow
  box-shadow: 0 0 50px #eeeeee

.custom-border
  border-radius: 10px

.stick-bottom
  position: absolute
  bottom: 0
  right: 0

.dapp-description
  font-size: 0.8em
</style>
