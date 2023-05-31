<template>
  <q-page padding>
    <span class="text-subtitle1">
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
            <!-- <q-input
              v-model="client.chronoClient"
              label="code client"
              type="text"
              id="chronoClient"
              class="bg-grey-3"
            /> -->
            <q-input
              v-model="editedClient.prenom"
              label="prénom"
              type="text"
              id="prenom"
              class="bg-grey-3"
            />
            <q-input
              v-model="editedClient.nom"
              label="nom"
              type="text"
              id="nom"
              class="bg-grey-3"
            />
            <q-input
              v-model="editedClient.codePostal"
              type="text"
              label="code postal"
              id="codePostal"
              class="bg-grey-3"
            />
            <q-input
              v-model="editedClient.ville"
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
            
            <q-toggle v-model="editedClient.actif"
            true-value="true"
            false-value="false"
            id="actif" 
            label="actif" />
            
            <!-- <q-input
              v-model="editedClient.codeFichierPartenaire"
              type="text"
              id="codeFichierPartenaire"
              label="codeFichierPartenaire"
              class="bg-grey-3"
            /> -->
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
import { isBoolean } from 'lodash';

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
      actif: true,
    });

    const editedClient = reactive({
      prenom: '',
      nom: '',
      codePostal: '',
      ville: '',
      codeFichierPartenaire: '',
      actif: true,
      
    });
   
    
    
    async function modifClient() {
      const updateClient={
        chronoClient: client.chronoClient,
        //prenom: editedClient.prenom != '' ? editedClient.prenom : client.prenom,
        prenom: editedClient.prenom, 
        nom: editedClient.nom, 
        codePostal: editedClient.codePostal,
        ville: editedClient.ville,
        dateDerniereCommande: client.dateDerniereCommande,
        codeFichierPartenaire: editedClient.codeFichierPartenaire,
        actif: editedClient.actif
      }
      const wd = await customersApiService.updateClient(updateClient);
      if (wd.isOk && wd.data) {
        return client;
      }
    }

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
    function toggleActif(){
      editedClient.actif = !editedClient.actif
    }
    
    /*On récupère les paramètres de la route courante, appelle une méthode asynchrone pour récupérer les données d'un client à partir de son code, 
        puis met à jour les propriétés de l'objet "client" avec les données récupérées. */
    onBeforeMount(async () => {
      const route = useRoute();
      const wd = await customersApiService.getClientById(
        String(route.params.chronoClient),
      );

      if (wd.isOk && wd.data) {
        console.log(wd);
        client.chronoClient = wd.data.chronoClient;
        client.prenom = wd.data.prenom;
        client.nom = wd.data.nom;
        client.codePostal = wd.data.codePostal;
        client.ville = wd.data.ville;
        client.dateDerniereCommande = wd.data.dateDerniereCommande;
        client.codeFichierPartenaire = wd.data.codeFichierPartenaire;
        client.actif=wd.data.actif

        editedClient.prenom = wd.data.prenom;
        editedClient.nom = wd.data.nom;
        editedClient.codePostal = wd.data.codePostal;
        editedClient.ville = wd.data.ville;
        editedClient.codeFichierPartenaire = wd.data.codeFichierPartenaire;
        editedClient.actif = wd.data.actif;
      }
    });

    return {
      client,
      editedClient,
      modifClient,
      supClient,
      toggleActif
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
