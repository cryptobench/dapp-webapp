<template>
  <q-page class="q-pa-lg">
    <div class="text-primary text-h3 text-weight-bold q-pa-lg">dApp Store</div>
    <div class="text-body1 text-golem-code q-pa-lg">
      With Golem Network, users can connect with ease and pay each other for
      sharing their unused resources. Golem’s democratized access combined with
      a unique peer-to-peer exchange creates an unstoppable ecosystem for a
      myriad of use-cases to be born, allowing software developers to leverage
      their creativity more than ever before.
    </div>
    <q-separator inset class="q-ma-lg" />
    <div
      class="q-pa-md row justify-start items-start q-gutter-lg"
      id="dapp-store"
    >
      <DappStoreCard
        v-for="dapp in dapps"
        :key="dapp.id"
        :id="dapp.id"
        :name="dapp.name"
        :description="dapp.description"
        :author="dapp.author"
        :image="dapp.image"
      ></DappStoreCard>
    </div>
  </q-page>
</template>

<script>
import { computed, defineComponent, ref } from "vue";
import { useDappstoreStore } from "stores/store";
import DappStoreCard from "components/DappStoreCard";

export default defineComponent({
  name: "StorePage",
  components: { DappStoreCard },
  setup() {
    const dappStore = useDappstoreStore();
    const loading = ref(true);
    const dapps = computed(() => dappStore.dapps);

    dappStore.getDapps().then(() => {
      loading.value = false;
    });

    return {
      dapps,
      loading,
    };
  },
});
</script>
