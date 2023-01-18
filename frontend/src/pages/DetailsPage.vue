<template>
  <q-page v-if="dapp" class="q-pa-lg">
    <div>
      <div class="row">
        <PageTitle :value="dapp.name" />
      </div>
      <div class="row">
        <div class="col-md-4 col-sm-6 col-xs-12 q-pa-sm">
          <q-card flat>
            <q-card-section>
              <AppProperty name="Status">
                <AppStatusBadge :status="dapp.status" />
              </AppProperty>
              <AppProperty :value="dapp.id" name="App ID" copy />
            </q-card-section>
          </q-card>
        </div>
        <div
          v-if="isOperational() && descriptor && usesHttpProxy()"
          class="col-md-4 col-sm-6 col-xs-12 q-pa-sm"
        >
          <q-card flat>
            <q-card-section>
              <AppProperty name="Local access link">
                <AppLink
                  :link="link"
                  title="View the app instance"
                  :loading="!link"
                />
              </AppProperty>

              <AppProperty name="Proxy access link">
                <AppLink
                  :link="proxyUrl"
                  title="View the app instance"
                  :loading="!proxyUrl"
                />
              </AppProperty>
            </q-card-section>
          </q-card>
        </div>
        <div v-if="dapp.status === 'active'" class="col-md-4 col-xs-12 q-pa-sm">
          <q-card flat>
            <q-card-section>
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
                v-if="isOperational()"
                unelevated
                square
                color="negative"
                :loading="killing"
                label="kill"
                icon="cancel"
                @click="kill(dapp.id)"
              ></q-btn>
            </q-card-section>
          </q-card>
        </div>
      </div>
      <div class="row">
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
            <q-tab name="stats" label="Stats" no-caps />
            <q-tab name="descriptor" label="Descriptor" no-caps />
          </q-tabs>

          <q-separator />

          <q-tab-panels v-model="tab">
            <q-tab-panel
              name="state"
              class="bg-dark text-white console q-pa-lg"
            >
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
            <q-tab-panel
              name="stdout"
              class="bg-dark text-white console q-pa-lg"
            >
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
            <q-tab-panel
              name="stderr"
              class="bg-dark text-white console q-pa-lg"
            >
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
            <q-tab-panel class="bg-golem" name="stats">
              <Suspense>
                <AppStats :app="dapp" />
                <template #fallback>
                  <p>Please wait...</p>
                </template>
              </Suspense>
            </q-tab-panel>
            <q-tab-panel
              name="descriptor"
              class="bg-dark text-white console q-pa-lg"
            >
              <q-scroll-area
                ref="consoleScroll"
                style="height: 100%; width: 100%"
                :thumb-style="thumbStyle"
                :bar-style="barStyle"
              >
                <!--YAML is not supported by simple syntax highlter -->
                <ssh-pre :dark="true">{{ yamlStringify(descriptor) }} </ssh-pre>
              </q-scroll-area>
            </q-tab-panel>
          </q-tab-panels>
        </q-card>
      </div>
      <div class="row">
        <div class="col-11">
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
        <div class="col-1 text-golem-gray">
          Refresh interval: <strong>5s</strong>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script>
import YAML from "yaml";
import { computed, defineComponent, onUnmounted, ref, watch } from "vue";
import { useRoute } from "vue-router";
import { useDappsStore } from "stores/dapps";
import { useQuasar } from "quasar";
import SshPre from "simple-syntax-highlighter";
import "simple-syntax-highlighter/dist/sshpre.css";
import AppStatusBadge from "components/App/AppStatusBadge.vue";
import PageTitle from "components/Typography/PageTitle.vue";
import AppStats from "components/App/Stats/AppStats.vue";
import AppLink from "components/App/AppLink.vue";
import AppProperty from "components/App/AppProperty.vue";

export default defineComponent({
  name: "IndexPage",
  components: {
    AppProperty,
    AppLink,
    AppStats,
    PageTitle,
    AppStatusBadge,
    SshPre,
  },
  setup() {
    const $q = useQuasar();
    const $route = useRoute();

    const { id } = $route.params;
    const dappStore = useDappsStore();

    const dapp = computed(() => dappStore.getDapp(id));
    const stateData = computed(() => dappStore.getStateData(id));
    const rawData = computed(() => dappStore.getRawData(id));
    const stdout = computed(() => dappStore.getStdout(id));
    const stderr = computed(() => dappStore.getStderr(id));
    const log = computed(() => dappStore.getLog(id));
    const descriptor = computed(() => dappStore.getDescriptor(id));

    const scrollToBottom = ref(true);
    const consoleScroll = ref(null);
    const stopping = ref(false);
    const killing = ref(false);
    const jsonFormat = ref(true);
    const loading = ref(true);
    const link = computed(() => dappStore.getLink(id));
    const proxyUrl = computed(() => dappStore.getProxyUrl(id));

    watch([stateData, rawData, stdout, stderr, log], () => {
      if (scrollToBottom?.value && consoleScroll?.value)
        consoleScroll.value.setScrollPercentage("vertical", 1.0);
    });

    watch(scrollToBottom, () => {
      if (scrollToBottom?.value && consoleScroll?.value)
        consoleScroll.value.setScrollPercentage("vertical", 1.0);
    });

    onUnmounted(() => dappStore.stopGettingData(id));

    const fetchDataFromBackend = async () => {
      await dappStore.getData(id);

      if (dapp.value?.status === "active") {
        await dappStore.startGettingData(id);
        await dappStore.setupLink(id);
      }
    };

    // ToDo: Don't trigger downloading all apps, target specific app instead
    //    Right now this is used only to fix a bug when someone is on the details page and hits refresh
    dappStore
      .getDapps()
      .then(fetchDataFromBackend)
      .finally(() => {
        loading.value = false;
      });
    return {
      dapp,
      tab: ref("state"),
      loading,
      stopping,
      killing,
      stateData,
      rawData,
      stdout,
      stderr,
      log,
      descriptor,
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
          dappStore.stopGettingData(id);
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
          dappStore.stopGettingData(id);
          dappStore.getDapps();
          dappStore.getData(id);
        });
      },
      isOperational: () => dapp.value.status === "active",
      usesHttpProxy: () => {
        return Object.entries(descriptor.value.nodes).some(
          ([, nodeSpec]) => !!nodeSpec.http_proxy
        );
      },
      jsonParse: (val) => {
        try {
          return JSON.stringify(JSON.parse(val || {}), null, 2);
        } catch {
          return val;
        }
      },
      yamlStringify: (val) => {
        return YAML.stringify(val);
      },
    };
  },

  beforeUnmount() {
    const $route = useRoute();
    const { id } = $route.params;
    const dappStore = useDappsStore();

    dappStore.stopGettingData(id);
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
