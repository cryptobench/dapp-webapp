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
        :quote="quote"
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
import { useUsageQuotesStore } from "stores/quotes";

export default defineComponent({
  name: "StorePage",
  components: { PageDescription, PageTitle, DappStoreCard },
  setup() {
    const dappStore = useDappstoreStore();
    const usageQuotes = useUsageQuotesStore();
    const loading = ref(true);
    const quote = ref({ limited: false, message: "" });
    const dapps = computed(() => dappStore.dapps);

    dappStore.getDapps().then(() => {
      null; // Not sure what to do here
    });
    usageQuotes.getQuoteLimits().then((response) => {
      if (response.globalActiveAppsLimitReached) {
        quote.value.message =
          "The global limit of active dapps has been reached. Try again later";
        quote.value.limited = true;
      }

      if (response.userActiveAppsLimitReached) {
        quote.value.message =
          "You have reached the limit of active dapps. Stop one to start another";
        quote.value.limited = true;
      }
    });

    loading.value = false;

    return {
      dapps,
      loading,
      quote,
    };
  },
});
</script>
