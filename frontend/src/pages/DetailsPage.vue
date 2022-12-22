<template>
  <q-page v-if="dapp" class="q-pa-lg">
    <div class="row flex justify-between items-baseline">
      <div class="col-auto">
        <div class="row">
          <div>
            <PageTitle :value="dapp.name" />
            <AppStatus :status="dapp.status" />
            <AppInstanceId :id="dapp.id" />
            <p v-if="link" class="service-link">
              <a title="View the running service" :href="link" target="_blank">
                <q-icon name="link" />
                {{ link }}</a
              >
            </p>
            <p v-if="proxyUrl" class="service-link">
              <a
                title="View the running service via proxy"
                :href="proxyUrl"
                target="_blank"
              >
                <q-icon name="link" />
                {{ proxyUrl }}</a
              >
            </p>
          </div>
        </div>
      </div>
      <div class="col flex justify-end q-gutter-md">
        <q-btn
          v-if="dapp.status === 'active'"
          unelevated
          square
          :loading="stopping"
          color="warning"
          label="stop"
          icon="stop_circle"
          @click="stop(dapp.id)"
        ></q-btn>
        <q-btn
          v-if="dapp.status === 'active'"
          unelevated
          square
          color="negative"
          :loading="killing"
          label="kill"
          icon="cancel"
          @click="kill(dapp.id)"
        ></q-btn>
      </div>
    </div>
    <div class="row flex justify-between items-center q-mt-xs">
      <q-card flat class="col">
        <q-tabs
          v-model="tab"
          align="left"
          indicator-color="primary"
          active-color="dark-page"
          class="bg-golem text-golem-gray"
        >
          <q-tab name="state" label="State" no-caps />
          <q-tab name="data" label="Data" no-caps />
          <q-tab name="stdout" label="Stdout" no-caps />
          <q-tab name="stderr" label="Stderr" no-caps />
          <q-tab name="log" label="Log" no-caps />
        </q-tabs>

        <q-separator />

        <q-tab-panels v-model="tab" animated>
          <q-tab-panel name="state" class="bg-dark text-white console q-pa-lg">
            <q-scroll-area
              ref="consoleScroll"
              style="height: 100%; width: 100%"
              :thumb-style="thumbStyle"
              :bar-style="barStyle"
            >
              <ssh-pre v-if="jsonFormat" language="json" :dark="true"
                >{{ jsonParse(stateData) }}
              </ssh-pre>
              <pre v-else>{{ stateData }}</pre>
            </q-scroll-area>
          </q-tab-panel>

          <q-tab-panel name="data" class="bg-dark text-white console q-pa-lg">
            <q-scroll-area
              ref="consoleScroll"
              style="height: 100%; width: 100%"
              :thumb-style="thumbStyle"
              :bar-style="barStyle"
            >
              <ssh-pre v-if="jsonFormat" language="json" :dark="true"
                >{{ jsonParse(rawData) }}
              </ssh-pre>
              <pre v-else>{{ rawData }}</pre>
            </q-scroll-area>
          </q-tab-panel>
          <q-tab-panel name="stdout" class="bg-dark text-white console q-pa-lg">
            <q-scroll-area
              ref="consoleScroll"
              style="height: 100%; width: 100%"
              :thumb-style="thumbStyle"
              :bar-style="barStyle"
            >
              <ssh-pre v-if="jsonFormat" language="json" :dark="true"
                >{{ jsonParse(stdout) }}
              </ssh-pre>
              <pre v-else>{{ stdout }}</pre>
            </q-scroll-area>
          </q-tab-panel>
          <q-tab-panel name="stderr" class="bg-dark text-white console q-pa-lg">
            <q-scroll-area
              ref="consoleScroll"
              style="height: 100%; width: 100%"
              :thumb-style="thumbStyle"
              :bar-style="barStyle"
            >
              <ssh-pre v-if="jsonFormat" language="json" :dark="true"
                >{{ jsonParse(stderr) }}
              </ssh-pre>
              <pre v-else>{{ stderr }}</pre>
            </q-scroll-area>
          </q-tab-panel>
          <q-tab-panel name="log" class="bg-dark text-white console q-pa-lg">
            <q-scroll-area
              ref="consoleScroll"
              style="height: 100%; width: 100%"
              :thumb-style="thumbStyle"
              :bar-style="barStyle"
            >
              <ssh-pre v-if="jsonFormat" language="json" :dark="true"
                >{{ jsonParse(log) }}
              </ssh-pre>
              <pre v-else>{{ log }}</pre>
            </q-scroll-area>
          </q-tab-panel>
        </q-tab-panels>
      </q-card>
    </div>
    <div class="row justify-between q-pa-xs q-gutter-md items-center">
      <div class="row justify-sm-start">
        <q-toggle
          v-model="scrollToBottom"
          label="Scroll to bottom"
          keep-color
          color="primary"
          size="xl"
        />
        <q-toggle
          v-model="jsonFormat"
          label="Highlight syntax"
          keep-color
          color="primary"
          size="xl"
        />
      </div>

      <div class="content-end text-golem-gray">
        Refresh interval: <strong>5s</strong>
      </div>
    </div>
  </q-page>
</template>

<script>
import { computed, defineComponent, onUnmounted, ref, watch } from "vue";
import { useRoute } from "vue-router";
import { useDappsStore } from "stores/dapps";
import { useQuasar } from "quasar";
import SshPre from "simple-syntax-highlighter";
import "simple-syntax-highlighter/dist/sshpre.css";
import AppStatus from "components/App/AppStatus.vue";
import AppInstanceId from "components/App/AppInstanceId.vue";
import PageTitle from "components/Typography/PageTitle.vue";

export default defineComponent({
  name: "IndexPage",
  components: { PageTitle, AppInstanceId, AppStatus, SshPre },
  setup() {
    const route = useRoute();
    const id = route.params.id;
    const dappStore = useDappsStore();
    const dapp = computed(() => dappStore.getDapp(id));
    const stateData = computed(() => dappStore.getStateData(id));
    const rawData = computed(() => dappStore.getRawData(id));
    const stdout = computed(() => dappStore.getStdout(id));
    const stderr = computed(() => dappStore.getStderr(id));
    const log = computed(() => dappStore.getLog(id));
    const scrollToBottom = ref(true);
    const consoleScroll = ref(null);
    const stopping = ref(false);
    const killing = ref(false);
    const jsonFormat = ref(true);
    const link = computed(() => dappStore.getLink(id));
    const proxyUrl = computed(() => dappStore.getProxyUrl(id));

    if (dapp.value?.status === "active") {
      dappStore.startGettingData(id);
    } else {
      dappStore.getData(id);
    }
    watch([stateData, rawData, stdout, stderr, log], () => {
      if (scrollToBottom?.value && consoleScroll?.value)
        consoleScroll.value.setScrollPercentage("vertical", 1.0);
    });
    watch(scrollToBottom, () => {
      if (scrollToBottom?.value && consoleScroll?.value)
        consoleScroll.value.setScrollPercentage("vertical", 1.0);
    });
    onUnmounted(() => dappStore.stopGettingData(id));
    const $q = useQuasar();

    dappStore.getDapps();

    return {
      dapp,
      tab: ref("state"),
      stopping,
      killing,
      stateData,
      rawData,
      stdout,
      stderr,
      log,
      link,
      proxyUrl,
      consoleScroll,
      scrollToBottom,
      jsonFormat,
      thumbStyle: {
        right: "4px",
        borderRadius: "5px",
        backgroundColor: "#027be3",
        width: "5px",
        opacity: 0.75,
      },
      barStyle: {
        right: "2px",
        borderRadius: "9px",
        backgroundColor: "#027be3",
        width: "9px",
        opacity: 0.2,
      },
      stop: (id) => {
        stopping.value = true;
        dappStore.stopDapp(id).then((result) => {
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
          stopping.value = false;
          dappStore.stopGettingData();
          dappStore.getDapps();
          dappStore.getData(id);
        });
      },
      kill: (id) => {
        killing.value = true;
        dappStore.killDapp(id).then((result) => {
          if (result) {
            $q.notify({
              type: "positive",
              textColor: "black",
              message: `dApp ${name} has been successfully killed`,
            });
          } else {
            $q.notify({
              type: "negative",
              message: `Some errors occurred while killing ${name}`,
            });
          }
          killing.value = false;
          dappStore.stopGettingData();
          dappStore.getDapps();
          dappStore.getData(id);
        });
      },
      jsonParse: (val) => {
        try {
          return JSON.stringify(JSON.parse(val || {}), null, 2);
        } catch {
          return val;
        }
      },
    };
  },
});
</script>
<style lang="sass">
.console
  height: 66vh !important

  pre
    margin: 0

  .ssh-pre
    margin: 0
    padding: 0

  .ssh-pre--dark
    background: inherit !important
</style>
