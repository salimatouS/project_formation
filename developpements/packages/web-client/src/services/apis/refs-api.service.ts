import {
  CodeLabelResultDto,
  IPaginatedListDto,
  ISearchDto,
  ProductDto,
  SearchProductDto,
  WorkDone
} from '@formation/shared-lib'
import { AxiosInstance } from 'axios'
import { AbstractApiService } from './abstract-api.service'

export class RefsApiService extends AbstractApiService {
[x: string]: any

  constructor(axiosInstance: AxiosInstance, serviceApiBaseUrl: string) {
    super(axiosInstance, serviceApiBaseUrl)
  }

  // Get "cdFichPart"'s customers list according to search criterias
  public async getAllFichierPartenaires(): Promise<WorkDone<CodeLabelResultDto[]>> {
    return this.doGet<CodeLabelResultDto[]>('/fichparts')
  }

  public async getProductListByCriterias (searchCriterias?: ISearchDto<SearchProductDto>): Promise<WorkDone<IPaginatedListDto<ProductDto>>> {
    return this.doGet('/products', searchCriterias)
  }

  public async getProducts(): Promise<WorkDone<IPaginatedListDto<ProductDto>>> {
    return this.doGet('/productsList')
  }

  public async getProduitsByCode(code:string): Promise<WorkDone<ProductDto>> {
    return this.doGet(`/produits/${code}`)
  }
// on donne la route et on rajoute les paramètres pour que ce soit modifié
  public async updateProduit(product:ProductDto): Promise<WorkDone<ProductDto>> {
    return this.doPut(`/produits/${product.code}`,{ code: product.code, libelle: product.libelle })
  }


  public async deleteProduit(code:string): Promise<WorkDone<string>> {
    return this.doDelete(`/produits/${code}`)
  }

 public async createProduit(product:ProductDto): Promise<WorkDone<string>> {
    return this.doPost('/produits',product)
  }


}
