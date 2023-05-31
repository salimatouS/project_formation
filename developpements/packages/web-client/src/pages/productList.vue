<template>
  <div>
    <ul>
      <li v-for="product in product" :key="product.code">
        {{ product.libelle }}
      </li>
    </ul>
  </div>
</template>

<script>
import { defineComponent, reactive } from 'vue';
import { refsApiService } from 'src/boot/api';

export default defineComponent({
  name: 'ProductList',
  setup() {
    const product = reactive([]);

    async function afficherProduit() {
      const wd = await refsApiService.getListProduits();

      if (wd.isOk) {
        product.code = wd.data.code;
        product.libelle = wd.data.libelle;
      }
    }
    return {
      afficherProduit,
    };
  },
});
</script>

<style lang="scss" scoped>
.my-card {
  width: 100%;
  max-width: 500px;
}
</style>
