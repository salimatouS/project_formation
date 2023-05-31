<template>
  <q-page class="items-center justify-evenly bg-grey-1">
    <product-search-component
      active
      title="Recherche produits"
    ></product-search-component>
  </q-page>
</template>

<script lang="ts">
import ProductSearchComponent from 'components/productSearchComponent/ProductSearchComponent.vue';
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'ProductPage',
  components: { ProductSearchComponent },
});
</script>
