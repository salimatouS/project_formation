<template>
  <q-page padding>
    <span class="text-subtitle1"
      ><!-- {{ product.libelle }} -->
      Fiche Detail Client {{ client.chronoClient }}
    </span>

    <div class="q-pa-md row items-start q-gutter-md">
      <q-card class="my-card text-black">
        <q-card-section class="bg-ligth-blue-3">
          <div class="text-h6 text-subtitle2">
            <span class="text-subtitle3"
              >Client: n° {{ client.chronoClient }}</span
            >
          </div>
        </q-card-section>

        <q-card-section>
          <div class="text-h6 text-subtitle2">
            <span class="text-subtitle2">Prénom: {{ client.prenom }}</span>
          </div>
        </q-card-section>
        <q-card-section>
          <div class="text-h6 text-subtitle2">
            <span class="text-subtitle2">nom: {{ client.nom }}</span>
          </div>
        </q-card-section>
        <q-card-section>
          <div class="text-h6 text-subtitle2">
            <span class="text-subtitle2"
              >Code Postal: {{ client.codePostal }}</span
            >
          </div>
        </q-card-section>
        <q-card-section>
          <div class="text-h6 text-subtitle2">
            <span class="text-subtitle2">ville: {{ client.ville }}</span>
          </div>
        </q-card-section>
        <q-card-section>
          <div class="text-h6 text-subtitle2">
            <span class="text-subtitle2"
              >Date derniere commande: {{ client.dateDerniereCommande }}</span
            >
          </div>
        </q-card-section>
        <q-card-section>
          <div class="text-h6 text-subtitle2">
            <span class="text-subtitle2"
              >Code Partenaire: {{ client.codeFichierPartenaire }}</span
            >
          </div>
        </q-card-section>
        <q-separator dark />
        <q-card-actions>
          <q-form @submit.prevent="modifClient">
            <q-btn
              class="bg-positive q-ma-md text-white"
              flat
              type="submit"
              label="Modifier"
            />
            <q-btn
              class="bg-negative q-ma-md text-white"
              flat
              @click="supClient"
              type="submit"
              label="Supprimer"
            />
            <q-input
              v-model="client.chronoClient"
              label="code client"
              type="text"
              id="chronoClient"
              class="bg-grey-3"
            />
            <q-input
              v-model="client.prenom"
              label="prénom"
              type="text"
              id="prenom"
              class="bg-grey-3"
            />
            <q-input
              v-model="client.nom"
              label="nom"
              type="text"
              id="nom"
              class="bg-grey-3"
            />
            <q-input
              v-model="client.codePostal"
              type="text"
              label="code postal"
              id="codePostal"
              class="bg-grey-3"
            />
            <q-input
              v-model="client.ville"
              label="ville"
              type="text"
              id="ville"
              class="bg-grey-3"
            />
            <q-input
              v-model="formattedDate"
              type="date"
              id="dateDerniereCommande"
              label="Date derniere commande"
              class="bg-grey-3"
            />
            <!--  <q-input
                v-model="client.dateDerniereCommande"
                type="text"
                id="dateDerniereCommande"
                class="bg-grey-3"
              /> -->
            <q-input
              v-model="client.codeFichierPartenaire"
              type="text"
              id="codeFichierPartenaire"
              label="codeFichierPartenaire"
              class="bg-grey-3"
            />
          </q-form>
        </q-card-actions>
      </q-card>
      <q-btn
        class="bg-pink-1"
        label="Retour Liste Clients"
        @click="$router.push('/customers')"
      />
    </div>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, onBeforeMount, reactive } from 'vue';
import { customersApiService } from 'src/boot/api';
import { useRoute, useRouter } from 'vue-router';
//import { date } from 'quasar';

export default defineComponent({
  name: 'CustomerDetailPage',

  setup() {
    const router = useRouter();
    const client = reactive({
      chronoClient: '',
      prenom: '',
      nom: '',
      codePostal: '',
      ville: '',
      dateDerniereCommande: new Date(),
      codeFichierPartenaire: '',
    });

    async function modifClient() {
      const wd = await customersApiService.updateClient(client);
      if (wd.isOk && wd.data) {
        return client;
      }
    }

    /*  async function supClient() {
        const wd = await customersApiService.deleteClient(client.chronoClient);
  
        if (wd.isOk) {
          console.log('Client supprimé');
          router
            .push({ path: '/customers' })
            .then(() => {
              console.log('ok');
            })
            .catch(() => {
              console.log('ko');
            });
        }
      } */

    async function supClient() {
      const confirmed = window.confirm(
        'Êtes-vous sûr de vouloir supprimer ce client ?',
      );
      if (confirmed) {
        const wd = await customersApiService.deleteClient(client.chronoClient);

        if (wd.isOk) {
          console.log('Client supprimé');
          router
            .push({ path: '/customers' })
            .then(() => {
              console.log('ok');
            })
            .catch(() => {
              console.log('ko');
            });
        }
      }
    }

    /*On récupère les paramètres de la route courante, appelle une méthode asynchrone pour récupérer les données d'un produit à partir de son code, 
        puis met à jour les propriétés de l'objet "product" avec les données récupérées. */
    onBeforeMount(async () => {
      const route = useRoute();
      const detailClient = await customersApiService.getClientById(
        String(route.params.chronoClient),
      );

      if (detailClient.isOk && detailClient.data) {
        console.log(detailClient);
        client.chronoClient = detailClient.data.chronoClient;
        client.prenom = detailClient.data.prenom;
        client.nom = detailClient.data.nom;
        client.codePostal = detailClient.data.codePostal;
        client.ville = detailClient.data.ville;
        client.dateDerniereCommande = detailClient.data.dateDerniereCommande;
        client.codeFichierPartenaire = detailClient.data.codeFichierPartenaire;
      }
    });

    return {
      client,
      modifClient,
      supClient,
    };
  },
  computed: {
    formattedDate: {
      get() {
        // Convert the Date object to a string representation
        return this.client.dateDerniereCommande.toISOString();
      },
      set(value: string) {
        // Convert the string back to a Date object
        this.client.dateDerniereCommande = new Date(value);
      },
    },
  },
});
</script>

<style lang="scss" scoped>
.my-card {
  width: 100%;
  max-width: 500px;
}
</style>
