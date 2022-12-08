<template>
  <q-page class="q-pa-lg">
    <h4 class="q-ma-md">Dapp Store</h4>
    <div
      class="q-pa-md row items-start items-stretch q-gutter-lg"
      id="dapp-store"
    >
      <DappStoreCard
        v-for="dapp in dapps"
        :key="dapp.id"
        :id="dapp.id"
        :name="dapp.name"
        :description="dapp.description"
        :icon="dapp.icon"
        :author="dapp.author"
      ></DappStoreCard>
    </div>
  </q-page>
</template>

<script>
import { defineComponent, ref, computed } from "vue";
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
