<template>
  <q-page class="items-center justify-evenly bg-grey-1">
    <shop-search-component
      active
      title="Recherche magasins"
    ></shop-search-component>
  </q-page>
</template>

<script lang="ts">
import shopSearchComponent from 'components/shopSearchComponent/ShopSearchComponent.vue';
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'ShopPage',
  components: { shopSearchComponent },
});
</script>
