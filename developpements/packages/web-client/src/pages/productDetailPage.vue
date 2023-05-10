<template>
  <q-page padding>
    <span class="text-subtitle1"
      ><!-- {{ product.libelle }} -->
      Fiche Detail Produit: {{ product.code }}
    </span>

    <div class="q-pa-md row items-start q-gutter-md">
      <q-card class="my-card text-black">
        <q-card-section class="bg-ligth-blue-3">
          <div class="text-h6 text-subtitle2">
            <span class="text-subtitle3">CODE: {{ product.code }}</span>
          </div>
        </q-card-section>

        <q-card-section>
          <div class="text-h6 text-subtitle2">
            <span class="text-subtitle2">LIBELLE: {{ product.libelle }}</span>
          </div>
        </q-card-section>
        <q-separator dark />
        <q-card-actions>
          <q-form @submit.prevent="modifProduct">
            <q-btn
              class="bg-positive q-ma-md text-white"
              flat
              type="submit"
              label="Modifier"
            />
            <q-btn
              class="bg-negative q-ma-md text-white"
              flat
              @click="supProduct"
              type="submit"
              label="Supprimer"
            />
            <q-input
              v-model="product.libelle"
              type="text"
              id="libelle"
              class="bg-grey-3"
            />
          </q-form>
        </q-card-actions>
      </q-card>
      <q-btn
        class="bg-pink-1"
        label="Retour Liste Produits"
        @click="$router.push({ path: '../products' })"
      />
    </div>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, onBeforeMount, reactive} from 'vue';
import { refsApiService } from 'src/boot/api';
import { useRoute, useRouter } from 'vue-router';

export default defineComponent({
  name: 'ProductDetailPage',

  setup() {

    const router = useRouter();
    const product = reactive({ code: '', libelle: '', commentaires: '' });
    
    async function modifProduct() {
      const wd = await refsApiService.updateProduit(product);
      if (wd.isOk && wd.data) {
        return product.libelle;
      }
    }

    async function supProduct() {
      const wd = await refsApiService.deleteProduit(product.code);

      if (wd.isOk) {
        console.log('Produit supprimé');
        router
          .push({ path: '../products' })
          .then(() => {
            console.log('ok');
          })
          .catch(() => {
            console.log('ko');
          });
      }
    }

    /*On récupère les paramètres de la route courante, appelle une méthode asynchrone pour récupérer les données d'un produit à partir de son code, 
      puis met à jour les propriétés de l'objet "product" avec les données récupérées. */
    onBeforeMount(async () => {
      const route = useRoute();
      const detailProduit = await refsApiService.getProduitsByCode(
        String(route.params.code),
      );
      if (detailProduit.isOk && detailProduit.data) {
        console.log(detailProduit);
        product.code = detailProduit.data.code;
        product.libelle = detailProduit.data.libelle;
      }
    });

    return {
      product,
      modifProduct,
      supProduct,
    
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

