/* eslint-disable @typescript-eslint/no-unsafe-return */
import {
  IPaginatedListDto,
  IPagination,
  ISearchDto,
  ITEMS_PER_PAGE,
  mandatoryValidator,
  ProductDto,
  SearchProductDto,
  textValidatorToFixed3,
  WorkDone,
} from '@formation/shared-lib';
import { defineComponent, reactive, Ref, ref } from 'vue';
import { refsApiService } from 'boot/api';
import {
  displayNotification,
  NotificationStatusEnum,
} from '../../services/common/notification.service';
//import { useRoute , useRouter} from 'vue-router';

/**
 * Composant permettant la détection des changement dans les form afin de gérer l'accès à certaine partie (ex: bouton rechercher)
 * @returns {{doOnFormChanged: (newValue: any) => void, resetFormChangedStatus: () => void, isFormChanged: () => boolean}}
 */
function defineFormChangedManager(): {
  doOnFormChanged: (newValue: any) => void;
  resetFormChangedStatus: () => void;
  isFormChanged: () => boolean;
} {
  const formChanged = ref(false);

  function doOnFormChanged(newValue: any) {
    formChanged.value = true;
  }

  function isFormChanged() {
    return formChanged.value;
  }

  function resetFormChangedStatus() {
    formChanged.value = false;
  }

  return {
    doOnFormChanged,
    isFormChanged,
    resetFormChangedStatus,
  };
}

export default defineComponent({
  name: 'ProductSearchComponent',
  props: {
    title: {
      type: String,
      required: true,
    },
  },
  setup() {
    //en utilisant une référence, l'objet peut être modifié de manière dynamique et réactive dans le code , tandis qu'en utilisant une variable simple, l'objet est statique et ne peut être modifié que de manière explicite.
    //const product: ProductDto = { code: '', libelle: '', commentaires: '' };
    const product = ref<ProductDto>({
      code: '',
      libelle: '',
      commentaires: '',
    });

    const formChangedManager = { ...defineFormChangedManager() };

    const searchAllResponse = ref<IPaginatedListDto<ProductDto>>();

    // Define the initial state of the form
    const initialFormState: SearchProductDto = {
      labelLike: '',
      codeLike:'',
      codepostalLike:''
    };

    const initialPagination: IPagination = {
      sortBy: 'libelle',
      descending: false,
      page: 1,
      rowsPerPage: ITEMS_PER_PAGE,
      rowsNumber: 0,
    };

    // Initialize reactive form with its initial state
    const form = reactive({
      ...initialFormState,
    });

    // Initialize reactive pagination with its initial state
    const pagination = ref({
      ...initialPagination,
    });

    const rows: Ref<ProductDto[]> = ref([]);
    const loading = ref(false);

    let currentSearchParams: SearchProductDto = {
      labelLike: '',
      codeLike:'',
      codepostalLike:''
    };

    const columns = [
      {
        name: 'code',
        required: true,
        label: 'Code',
        align: 'center',
        field: (row: ProductDto) => row.code,
        format: (val: string) => `${val}`,
        sortable: true,
      },
      {
        name: 'libelle',
        required: true,
        label: 'Libellé',
        align: 'left',
        field: (row: ProductDto) => row.libelle,
        format: (val: string) => `${val}`,
        sortable: true,
      },
      {
        name: 'nombreOffre',
        required: true,
        label: 'nbreOffre',
        align: 'rigth',
        field: (row:any) => row._count.offres,//recuperation de la valeur de l'offre
        format: (val: string) => `${val}`,
        sortable: true,
      },
    ];

    async function doPagination(props: any) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      pagination.value = props.pagination;

      // get all rows if "All" (0) is selected
      pagination.value.rowsPerPage =
        pagination.value.rowsPerPage === 0
          ? pagination.value.rowsNumber
          : pagination.value.rowsPerPage;

      const searchAllParams = {
        criterias: currentSearchParams,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
        pagination: pagination.value,
      };

      await _doSearchAll(searchAllParams);
    }

    async function doSearchAll() {
      const searchAllParams: ISearchDto<SearchProductDto> = {
        criterias: {
          labelLike: form.labelLike,
          codeLike:form.codeLike,
          codepostalLike:form.codepostalLike
        
        },
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
        pagination: initialPagination,
      };

      currentSearchParams = searchAllParams.criterias as SearchProductDto;

      if (!doCheckForSearch(searchAllParams)) {
        displayNotification(
          NotificationStatusEnum.WARNING,
          'Entrez au moins un critère de recherche',
        );
        return;
      }

      const wd = await _doSearchAll(searchAllParams);
      if (wd.isOk) {
        formChangedManager.resetFormChangedStatus();
      }
    }

    function doCheckForSearch(searchAllParams: ISearchDto<SearchProductDto>) {
      return !!searchAllParams.criterias?.labelLike || !!searchAllParams.criterias?.codeLike || !!searchAllParams.criterias?.codepostalLike;
    }

    async function _doSearchAll(
      searchAllParams: ISearchDto<SearchProductDto>,
    ): Promise<WorkDone<boolean>> {
      loading.value = true;
      const wd = await refsApiService.getProductListByCriterias(
        searchAllParams,
      );
      if (wd.isOk && !!wd.data) {
        //!! force la conversion de wd.data en un booleen (si wd.data n'est pas nulle)
        console.log(wd.data);
        searchAllResponse.value = wd.data;

        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        pagination.value.rowsNumber =
          wd.data.rowsNumber ?? searchAllParams.pagination.rowsNumber;
      }
      loading.value = false;
      console.log(wd);
      // return WorkDone.toOkNotOk(wd)
      return WorkDone.buildOk(true);
    }

    // Reset the form to it's initial state
    function resetForm() {
      Object.assign(form, initialFormState);
    }    

    return {
      doSearchAll,
      resetForm,
      mandatoryValidator,
      textValidatorToFixed3,
      doPagination,
      searchAllResponse,
      form,
      product,
      columns,
      rows,
      loading,
      pagination,
      confirm: ref(false),
      ...formChangedManager,
    };
  },

  methods: {
    //permet
    onRowClick(evt: any, row: ProductDto) {
      //void this.$router.push({path:`produits/${row.code}`}) equivalent à :
      void this.$router.push(`produits/${row.code}`);
      //void this.$router.push(`productList`)
    },

    async creerProduit() {

      const wd = await refsApiService.createProduit(this.product);

      if (wd.isOk) {
        console.log('Produit créé');
      }
      this.confirm = false;
      
    },
  },
});
