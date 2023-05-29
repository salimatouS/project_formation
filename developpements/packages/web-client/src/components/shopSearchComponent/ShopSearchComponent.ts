/* eslint-disable @typescript-eslint/no-unsafe-return */
import {
    IPaginatedListDto,
    IPagination,
    ISearchDto,
    ITEMS_PER_PAGE,
    mandatoryValidator,
    SearchShopDto,
    ShopDto,
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
    name: 'ShopSearchComponent',
    props: {
        title: {
            type: String,
            required: true,
        },
    },
    setup() {
        const shop = ref<ShopDto>({
            code: '',
            nom: '',
            ville: '',
            codepostal: ''
        });

        const formChangedManager = { ...defineFormChangedManager() };

        const searchAllResponse = ref<IPaginatedListDto<ShopDto>>();

        // Define the initial state of the form
        const initialFormState: SearchShopDto = {
            labelLike: '',
            codeLike: '',
            codepostalLike:''
        };

        const initialPagination: IPagination = {
            sortBy: 'nom',
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

        const rows: Ref<ShopDto[]> = ref([]);
        const loading = ref(false);

        let currentSearchParams: SearchShopDto = {
            labelLike: '',
            codeLike: '',
            codepostalLike:''
        };

        const columns = [
            {
                name: 'code',
                required: true,
                label: 'code',
                align: 'center',
                field: (row: ShopDto) => row.code,
                format: (val: string) => `${val}`,
                sortable: true,
            },
            {
                name: 'nom',
                required: true,
                label: 'nom',
                align: 'left',
                field: (row: ShopDto) => row.nom,
                format: (val: string) => `${val}`,
                sortable: true,
            },
            {
                name: 'ville',
                required: true,
                label: 'ville',
                align: 'left',
                field: (row: ShopDto) => row.ville,
                format: (val: string) => `${val}`,
                sortable: true,
            },
            {
                name: 'codepostal',
                required: true,
                label: 'code postal',
                align: 'left',
                field: (row: ShopDto) => row.codepostal,
                format: (val: string) => `${val}`,
                sortable: true,
            },
            /* {
                name: 'nombreOffre',
                required: true,
                label: 'nbreOffre',
                align: 'rigth',
                field: (row: any) => row._count.offres,//recuperation de la valeur de l'offre
                format: (val: string) => `${val}`,
                sortable: true,
            }, */
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
            const searchAllParams: ISearchDto<SearchShopDto> = {
                criterias: {
                    labelLike: form.labelLike,
                    codeLike: form.codeLike,
                    codepostalLike:form.codepostalLike

                },
                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
                pagination: initialPagination,
            };

            currentSearchParams = searchAllParams.criterias as SearchShopDto;

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

        function doCheckForSearch(searchAllParams: ISearchDto<SearchShopDto>) {
            return !!searchAllParams.criterias?.labelLike || !!searchAllParams.criterias?.codeLike || !!searchAllParams.criterias?.codepostalLike;
        }

        async function _doSearchAll(
            searchAllParams: ISearchDto<SearchShopDto>,
        ): Promise<WorkDone<boolean>> {
            loading.value = true;
            const wd = await refsApiService.getShopListByCriterias(
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
            shop,
            columns,
            rows,
            loading,
            pagination,
            confirm: ref(false),
            ...formChangedManager,
        };
    },

    methods: {
        //permet de rediriger vers la route detail produit au click
        onRowShopClick(evt: any, row: ShopDto) {
            void this.$router.push(`magasins/${row.code}`);
        },

        async creerShop() {

            const wd = await refsApiService.createShop(this.shop);

            if (wd.isOk) {
                console.log('Produit créé');
            }
            this.confirm = false;

        },
    },
});