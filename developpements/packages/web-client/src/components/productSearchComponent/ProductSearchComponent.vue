<template>
  <div>
    <div class="q-pa-sm q-pa-md-md">
      <h4>{{ title }}</h4>
      <q-form @reset="resetForm" @submit="doSearchAll">
        <div class="q-pa-md">
          <div class="row q-col-gutter-xs q-col-gutter-md-md">
            <q-input
              v-model="form.labelLike"
              :lazy-rules="true"
              :rules="[textValidatorToFixed3]"
              class="col-12 col-md-4"
              hint="Contient (min: 3)"
              label="Libellé"
              stack-label
              @update:model-value="doOnFormChanged"
            />
            <q-input
              v-model="form.codeLike"
              :lazy-rules="true"
              :rules="[textValidatorToFixed3]"
              class="col-12 col-md-4"
              hint="Contient (min: 3)"
              label="code"
              stack-label
              @update:model-value="doOnFormChanged"
            />
            <!--lazy-rules permet de valider le formulaire seulement lorsque l'utilisateur aura soumis le formulaire-->
          </div>

          <div class="row justify-end">
            <q-btn
              :disable="!isFormChanged()"
              color="primary"
              icon="fa fa-search"
              label="Rechercher"
              type="submit"
            />
            <q-btn
              class="q-ml-sm"
              color="primary"
              flat
              label="R.A.Z."
              type="reset"
            />
          </div>
        </div>
      </q-form>
    </div>
    <div class="q-px-sm q-px-md-md">
      <q-table
        v-model:pagination="pagination"
        :columns="columns"
        :grid="$q.screen.lt.md"
        :loading="loading"
        :rows="searchAllResponse"
        binary-state-sort
        row-key="code"
        style="width: 100%"
        title="Liste des produits"
        @request="doPagination"
        @row-click="onRowClick"
      >
      </q-table>
    </div>
    <div>
      <div>
        <q-btn
          class="q-mt-xl q-ml-sm q-pa-md bg-pink-1"
          label="Créer un produit"
          @click="confirm = true"
        />
        <q-dialog v-model="confirm" persistent>
          <q-card class="bg-cyan-1">
            <q-card-section>
  
                <q-input v-model="product.code" label="Code du produit" />
                <q-input
                  v-model="product.libelle"
                  id="libelle"
                  label="libelle"
                />
              
                <q-input
                  v-model="product.commentaires"
                  id="commentaires"
                  label="commentaires"
                />

                <q-btn
                  flat
                  type="submit"
                  label="Créer"
                  @click="creerProduit"
                  v-close-popup
                />
                <q-btn flat type="button" label="Annuler" v-close-popup />
  
            </q-card-section>
          </q-card>
        </q-dialog>
      </div>
    </div>
  </div>
</template>

<script lang="ts" src="./ProductSearchComponent.ts"></script>
<style lang="scss" src="./ProductSearchComponent.scss"></style>
