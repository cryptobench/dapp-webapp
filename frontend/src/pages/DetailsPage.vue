<template>
  <q-page class="q-pa-lg">
    <div class="row flex justify-between items-baseline">
      <div class="col-auto">
        <div class="row">
          <q-avatar><q-icon size="md" :name="dapp.icon" /></q-avatar>
          <div>
            <h5 class="q-my-sm">
              {{ dapp.name }}
              <q-badge
                :color="statusColor(dapp.status)"
                :label="dapp.status"
                align="middle"
              />
            </h5>
            <p v-if="link" class="service-link">
              <a title="View the running service" :href="link" target="_blank"><q-icon name="link"/> {{link}}</a>
            </p>
            <p v-if="proxyUrl" class="service-link">
              <a title="View the running service via proxy" :href="proxyUrl" target="_blank"><q-icon name="link"/> {{proxyUrl}}</a>
            </p>
            <p>
              ID: <b>{{ dapp.id }}</b>
            </p>
          </div>
        </div>
      </div>
      <div class="col flex justify-end q-gutter-md">
        <q-btn
          v-if="dapp.status === 'active'"
          size="md"
          :loading="stopping"
          color="warning"
          label="stop"
          icon="cancel"
          style="min-width: 90px"
          @click="stop(dapp.id)"
        ></q-btn>
        <q-btn
          v-if="dapp.status === 'active'"
          size="md"
          color="negative"
          :loading="killing"
          label="kill"
          icon="stop_circle"
          style="min-width: 90px"
          @click="kill(dapp.id)"
        ></q-btn>
      </div>
    </div>
    <div class="row flex justify-between items-center q-mt-xs">
      <q-card class="col">
        <q-tabs
          v-model="tab"
          class="bg-secondary text-white"
          active-color="white"
          align="justify"
          dense
        >
          <q-tab name="state" label="State" />
          <q-tab name="data" label="Data" />
          <q-tab name="stdout" label="Stdout" />
          <q-tab name="stderr" label="Stderr" />
          <q-tab name="log" label="Log" />
        </q-tabs>

        <q-separator />

        <q-tab-panels v-model="tab" animated>
          <q-tab-panel
            name="state"
            class="bg-black text-white console q-pa-lg"
          >
            <q-scroll-area
              style="height: 100%; width: 100%"
              ref="consoleScroll"
              :thumb-style="thumbStyle"
              :bar-style="barStyle"
            >
              <ssh-pre v-if="jsonFormat" language="json" :dark="true">{{ jsonParse(stateData) }}</ssh-pre>
              <pre v-else>{{stateData}}</pre>
            </q-scroll-area>
          </q-tab-panel>

          <q-tab-panel name="data" class="bg-black text-white console q-pa-lg">
            <q-scroll-area
              style="height: 100%; width: 100%"
              ref="consoleScroll"
              :thumb-style="thumbStyle"
              :bar-style="barStyle"
            >
              <ssh-pre v-if="jsonFormat" language="json" :dark="true">{{ jsonParse(rawData) }}</ssh-pre>
              <pre v-else>{{rawData}}</pre>
            </q-scroll-area>
          </q-tab-panel>
          <q-tab-panel name="stdout" class="bg-black text-white console q-pa-lg">
            <q-scroll-area
              style="height: 100%; width: 100%"
              ref="consoleScroll"
              :thumb-style="thumbStyle"
              :bar-style="barStyle"
            >
              <ssh-pre v-if="jsonFormat" language="json" :dark="true">{{ jsonParse(stdout) }}</ssh-pre>
              <pre v-else>{{stdout}}</pre>
            </q-scroll-area>
          </q-tab-panel>
          <q-tab-panel name="stderr" class="bg-black text-white console q-pa-lg">
            <q-scroll-area
              style="height: 100%; width: 100%"
              ref="consoleScroll"
              :thumb-style="thumbStyle"
              :bar-style="barStyle"
            >
              <ssh-pre v-if="jsonFormat" language="json" :dark="true">{{ jsonParse(stderr) }}</ssh-pre>
              <pre v-else>{{stderr}}</pre>
            </q-scroll-area>
          </q-tab-panel>
          <q-tab-panel name="log" class="bg-black text-white console q-pa-lg">
            <q-scroll-area
              style="height: 100%; width: 100%"
              ref="consoleScroll"
              :thumb-style="thumbStyle"
              :bar-style="barStyle"
            >
              <ssh-pre v-if="jsonFormat" language="json" :dark="true">{{ jsonParse(log) }}</ssh-pre>
              <pre v-else>{{log}}</pre>
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
          size="xs"
          color="secondary"
          class="text-caption"
        />
        <q-toggle
          v-model="jsonFormat"
          label="Highlight syntax"
          size="xs"
          color="secondary"
          class="text-caption"
        />
      </div>

      <div class="text-caption content-end">Refresh interval: <b>5s</b></div>
    </div>
  </q-page>
</template>

<script>
import { defineComponent, ref, onUnmounted, computed, watch } from "vue";
import { useRoute } from "vue-router";
import { useDappsStore } from "stores/dapps";
import { useQuasar } from "quasar";
import SshPre from 'simple-syntax-highlighter'
import 'simple-syntax-highlighter/dist/sshpre.css'

export default defineComponent({
  name: "IndexPage",
  components: { SshPre },
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
    const jsonFormat = ref(false);
    const link = computed(() => dappStore.getLink(id));
    const proxyUrl = computed(() => dappStore.getProxyUrl(id));
    if (dapp.value.status === 'active') {
      dappStore.startGettingData(id);
    } else {
      dappStore.getData(id);
    }
    watch([stateData, rawData, stdout, stderr, log], () => {
      if (scrollToBottom?.value)
        consoleScroll.value.setScrollPercentage("vertical", 1.0);
    });
    watch(scrollToBottom, () => {
      if (scrollToBottom?.value)
        consoleScroll.value.setScrollPercentage("vertical", 1.0);
    });
    onUnmounted(() =>  dappStore.stopGettingData(id));
    const $q = useQuasar();
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
      statusColor: (status) => {
        if (status === "active") return "positive";
        if (status === "unknown_app") return "warning";
        if (status === "dead") return "negative";
        return "primary";
      },
      stop: (id) => {
        stopping.value = true;
        dappStore.stopDapp(id).then((result) => {
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
              message: `Dapp ${name} has been successfully killed`,
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
      }
    };
  },
});
</script>
<style lang="sass">
.console
  height: 66vh !important
  background: black
  pre
    margin: 0
  .ssh-pre
    margin: 0
    padding: 0
  .ssh-pre--dark
    background: inherit !important
</style>
