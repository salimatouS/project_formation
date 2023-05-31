<template>
  <q-page padding>
    <span class="text-subtitle1"> Fiche Detail Magasin: {{ shop.code }} </span>

    <div class="q-pa-md row items-start q-gutter-md">
      <q-card class="my-card text-black">
        <q-card-section class="bg-ligth-blue-3">
          <div class="text-h6 text-subtitle2">
            <span class="text-subtitle3">CODE: {{ shop.code }}</span>
          </div>
        </q-card-section>

        <q-card-section>
          <div class="text-h6 text-subtitle2">
            <span class="text-subtitle2">NOM: {{ shop.nom }}</span>
          </div>
        </q-card-section>
        <q-card-section>
          <div class="text-h6 text-subtitle2">
            <span class="text-subtitle2"
              >CODE POSTAL: {{ shop.codepostal }}</span
            >
          </div>
        </q-card-section>
        <q-card-section>
          <div class="text-h6 text-subtitle2">
            <span class="text-subtitle2">VILLE: {{ shop.ville }}</span>
          </div>
        </q-card-section>
        <q-separator dark />
        <q-card-actions>
          <q-form @submit.prevent="modifShop">
            <q-btn
              class="bg-positive q-ma-md text-white"
              flat
              type="submit"
              label="Modifier"
            />
            <q-btn
              class="bg-negative q-ma-md text-white"
              flat
              @click="supShop"
              type="submit"
              label="Supprimer"
            />
            <q-input
              v-model="shop.code"
              label="code"
              type="text"
              id="nom"
              class="bg-grey-3"
            />
            <q-input
              v-model="shop.nom"
              label="nom"
              type="text"
              id="nom"
              class="bg-grey-3"
            />
            <q-input
              v-model="shop.codepostal"
              label="code postal"
              type="text"
              id="codepostal"
              class="bg-grey-3"
            />
            <q-input
              v-model="shop.ville"
              label="ville"
              type="text"
              id="ville"
              class="bg-grey-3"
            />
          </q-form>
        </q-card-actions>
      </q-card>
      <q-btn
        class="bg-pink-1"
        label="Retour Liste Magasins"
        @click="$router.push({ path: '../shop' })"
      />
    </div>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, onBeforeMount, reactive } from 'vue';
import { refsApiService } from 'src/boot/api';
import { useRoute, useRouter } from 'vue-router';

export default defineComponent({
  name: 'ShopDetailPage',

  setup() {
    const router = useRouter();
    const shop = reactive({ code: '', nom: '', codepostal: '', ville: '' });

    async function modifShop() {
      const wd = await refsApiService.updateShop(shop);
      if (wd.isOk && wd.data) {
        return shop.nom;
      }
    }

    async function supShop() {
      const confirmed = window.confirm(
        'Êtes-vous sûr de vouloir supprimer ce magasin ?',
      );
      if (confirmed) {
        const wd = await refsApiService.deleteShop(shop.code);

        if (wd.isOk) {
          console.log('Magasin supprimé');
          router
            .push({ path: '../shop' })
            .then(() => {
              console.log('ok');
            })
            .catch(() => {
              console.log('ko');
            });
        }
      }
    }

    /*On récupère les paramètres de la route courante, appelle une méthode asynchrone pour récupérer les données d'un magasin à partir de son code, 
        puis met à jour les propriétés de l'objet "shop" avec les données récupérées. */
    onBeforeMount(async () => {
      //execution avant que le composant ne soit monté
      const route = useRoute();
      const wd = await refsApiService.getShopByCode(
        String(route.params.code),
      );
      if (wd.isOk && wd.data) {
        console.log(wd);
        shop.code = wd.data.code;
        shop.nom = wd.data.nom;
        if (wd.data.codepostal !== undefined) {
          shop.codepostal = wd.data.codepostal;
        }
        if (wd.data.ville !== undefined) {
          shop.ville = wd.data.ville;
        }
        //shop.codepostal = wd.data.codepostal;
        //shop.ville = wd.data.ville;
      }
    });

    return {
      shop,
      modifShop,
      supShop,
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
