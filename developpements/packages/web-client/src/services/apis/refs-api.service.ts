import {
  CodeLabelResultDto,
  IPaginatedListDto,
  ISearchDto,
  ProductDto,
  SearchProductDto,
  SearchShopDto,
  ShopDto,
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

  //permet de faire la recherche par critères
  public async getProductListByCriterias (searchCriterias?: ISearchDto<SearchProductDto>): Promise<WorkDone<IPaginatedListDto<ProductDto>>> {
    return this.doGet('/products', searchCriterias)
  }

 

  /* public async getProducts(): Promise<WorkDone<IPaginatedListDto<ProductDto>>> {
    return this.doGet('/productsList')
  } */

 /*  public async getListProduits(): Promise<WorkDone<IPaginatedListDto<ProductDto>>> {
    return this.doGet('/productsList')
  } */

  // permet de recuperer les parametres du produit et l'afficher dans la page detailproduit
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

  //partie Magasins
  
  public async getShopListByCriterias (searchCriterias?: ISearchDto<SearchShopDto>): Promise<WorkDone<IPaginatedListDto<ShopDto>>> {
    return this.doGet('/shop', searchCriterias)
  }

  public async getMagasinsByCode(code:string): Promise<WorkDone<ShopDto>> {
    return this.doGet(`/magasins/${code}`)
  }

  public async createShop(shop:ShopDto): Promise<WorkDone<string>> {
    return this.doPost('/magasins',shop)
  }

  public async updateShop(shop:ShopDto): Promise<WorkDone<ShopDto>> {
    return this.doPut(`/magasins/${shop.code}`,{ code:shop.code, nom:shop.nom ,ville:shop.ville, codepostal:shop.codepostal})
  }

  public async deleteShop(code:string): Promise<WorkDone<string>> {
    return this.doDelete(`/magasins/${code}`)
  }

 
}
