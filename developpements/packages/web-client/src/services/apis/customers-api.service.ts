import {
  CustomerSearchResultDto,
  IPaginatedListDto,
  ISearchDto,
  SearchCustomerByChronoClientDto,
  SearchCustomerDto,
  WorkDone
} from '@formation/shared-lib'
import { AxiosInstance } from 'axios'
import { AbstractApiService } from './abstract-api.service'
import { promises } from 'dns'

export class CustomersApiService extends AbstractApiService {

  constructor (axiosInstance: AxiosInstance, serviceApiBaseUrl: string) {
    super(axiosInstance, serviceApiBaseUrl)
  }

  // Get an customer by "cdFichPart" en "nmChroClie"
  public async getCustomerById (searchParams: SearchCustomerByChronoClientDto): Promise<WorkDone<CustomerSearchResultDto>> {
    return this.doGet('/search/one', searchParams)
  }

  // Get "cdFichPart"'s customers list according to search criterias
  public async getCustomerListByCriterias (searchCriterias?: ISearchDto<SearchCustomerDto>): Promise<WorkDone<IPaginatedListDto<CustomerSearchResultDto>>> {
    return this.doGet('/search/multi-criterias', searchCriterias)
  }

  public async getClientById(chronoClient:string):Promise<WorkDone<CustomerSearchResultDto>> {
    return this.doGet(`/client/${chronoClient}`)
  }

  public async deleteClient(chronoClient:string): Promise<WorkDone<string>> {
    return this.doDelete(`/client/${chronoClient}`)
  }

  public async createClient(client:SearchCustomerDto): Promise<WorkDone<string>> {
    return this.doPost('/client',client)
  }
  public async updateClient(client:CustomerSearchResultDto): Promise<WorkDone<CustomerSearchResultDto>> {
    return this.doPut(`/client/${client.chronoClient}`,{ prenom: client.prenom,
      nom:client.nom,
      codePostal:client.codePostal,
      ville:client.ville,
      dateDerniereCommande:client.dateDerniereCommande,
      codeFichierPartenaire:client.codeFichierPartenaire})
  }
}
