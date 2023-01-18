<template>
  <q-page class="q-pa-lg">
    <q-inner-loading label="Plase wait..." :showing="loading" />
    <PageTitle value="dApp Store" />
    <PageDescription>
      With Golem Network, users can connect with ease and pay each other for
      sharing their unused resources. Golem’s democratized access combined with
      a unique peer-to-peer exchange creates an unstoppable ecosystem for a
      myriad of use-cases to be born, allowing software developers to leverage
      their creativity more than ever before.
    </PageDescription>
    <q-separator inset class="q-ma-lg" />
    <div
      id="dapp-store"
      class="q-pa-md row justify-start items-start items-stretch q-gutter-lg"
    >
      <DappStoreCard
        v-for="dapp in dapps"
        :id="dapp.id"
        :key="dapp.id"
        :name="dapp.name"
        :description="dapp.description"
        :author="dapp.author"
        :image="dapp.image"
        :quota="quota"
      ></DappStoreCard>
    </div>
  </q-page>
</template>

<script>
import { computed, defineComponent, ref } from "vue";
import { useDappstoreStore } from "stores/store";
import DappStoreCard from "components/Catalogue/DappStoreCard.vue";
import PageTitle from "components/Typography/PageTitle.vue";
import PageDescription from "components/Typography/PageDescription.vue";
import { useUsageQuotaStore } from "stores/quotas";
import { useQuasar } from "quasar";

export default defineComponent({
  name: "StorePage",
  components: { PageDescription, PageTitle, DappStoreCard },
  setup() {
    const $q = useQuasar();
    const dappStore = useDappstoreStore();
    const usageQuotas = useUsageQuotaStore();
    const loading = ref(true);
    const quota = ref({ limitReached: false, message: "" });
    const dapps = computed(() => dappStore.dapps);

    const getDataFromBackend = async () => {
      await dappStore.getDapps();
      const response = await usageQuotas.getQuotaLimits();

      if (response.globalActiveAppsLimitReached) {
        quota.value = {
          message:
            "The global limit of active dapps has been reached. Try again later",
          limitReached: true,
        };
      }

      if (response.userActiveAppsLimitReached) {
        quota.value = {
          message:
            "You have reached the limit of active dapps. Stop one to start another",
          limitReached: true,
        };
      }

      loading.value = false;
    };

    getDataFromBackend().catch((error) => {
      $q.notify({
        message: `Error: ${error}`,
        type: "negative",
      });
    });

    return {
      dapps,
      loading,
      quota,
    };
  },
});
</script>
