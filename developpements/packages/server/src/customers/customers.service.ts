import {
  LoggerService,
  PrismaService
} from '@formation/servers-lib/dist/services'
import {
  CustomerSearchResultDto,
  IPaginatedListDto,
  ISearchDto,
  SearchCustomerDto,
  WorkDone
} from '@formation/shared-lib'
import { Injectable } from '@nestjs/common'

// function toCustomerSearchResultDtoRowMapper (row: any): CustomerSearchResultDto {
//   return {
//     codeFichierPartenaire: row.CD_FICHPART,
//     chronoClient: row.NM_CHROCLIE,
//     prenom: row.LB_PREN,
//     nom: row.LB_NOM,
//     codePostal: row.CD_POST,
//     ville: row.LB_COMM,
//     dateDerniereCommande: row.DT_COMM
//   }
// }

@Injectable()
export class CustomersService {


  constructor (
    private readonly logger: LoggerService,
    private readonly prismaService: PrismaService,
  ) {
    this.logger.info('CustomersService created')
  }

  async findOne (codeFichierPartenaire: string, chronoClient: string): Promise<WorkDone<CustomerSearchResultDto>> {
   
    return WorkDone.buildOk(
      {
        
        codeFichierPartenaire: '001',
        chronoClient: '11111111',
        nom: 'Doe',
        prenom: 'John',
        codePostal: '34130',
        ville: 'Mauguio',
        dateDerniereCommande: null,
        actif:true
      }
    )
  }

   async searchCustomer(searchDto: ISearchDto<SearchCustomerDto>): Promise<WorkDone<IPaginatedListDto<CustomerSearchResultDto>>> {
    const whereClause: any = {
      codeFichierPartenaire: {
        contains: searchDto.criterias.codeFichierPartenaire,
      },
      chronoClient: {
        contains: searchDto.criterias.chronoClient,
        mode: 'insensitive',
      },
      nom: {
        contains: searchDto.criterias.nom,
        mode: 'insensitive',
      },
      prenom: {
        contains: searchDto.criterias.prenom,
        mode: 'insensitive',
      },
      codePostal: {
        contains: searchDto.criterias.codePostal,
        mode: 'insensitive',
      },
      actif:{
        equals:searchDto.criterias.actif}
    };

    const dbCustomer = await this.prismaService.clients.findMany({
      where: whereClause,
    });
  
    const dbCustomerWithBackground = dbCustomer.map((customer) => ({
      ...customer,
      background: customer.actif ? 'green' : 'red',
    }));

    const dbCustomerPaginated: IPaginatedListDto<CustomerSearchResultDto> = {
      list: dbCustomerWithBackground,
      rowsNumber: dbCustomer.length,
    };
  
    return WorkDone.buildOk<IPaginatedListDto<CustomerSearchResultDto>>(dbCustomerPaginated);
  } 

  /* async searchCustomer (searchDto: ISearchDto<SearchCustomerDto>): Promise<WorkDone<IPaginatedListDto<CustomerSearchResultDto>>> {
  const dbCustomer= await this.prismaService.clients.findMany({
    where:{
      codeFichierPartenaire:{
        contains:searchDto.criterias.codeFichierPartenaire,
      },
        chronoClient:{
        contains:searchDto.criterias.chronoClient,
        mode:'insensitive'      },
      nom:{
        contains:searchDto.criterias.nom,
        mode:'insensitive'
      },
      prenom:{
        contains:searchDto.criterias.prenom,
        mode:'insensitive'
      },
      codePostal:{
        contains:searchDto.criterias.codePostal,
        mode:'insensitive'
      },
     actif:searchDto.criterias.actif,                                    
    }
  });

  const dbCustomerPaginated : IPaginatedListDto<CustomerSearchResultDto> = {list : dbCustomer, rowsNumber : 100} 


    return WorkDone.buildOk<IPaginatedListDto<CustomerSearchResultDto>>(dbCustomerPaginated)
  } */

  async createClient(client:CustomerSearchResultDto): Promise<WorkDone<string>> {
    //check if client with same code already exists
    console.log('creer client',client)
    if ((await this.getClientById(client.chronoClient)).isOk) {
      
      return WorkDone.buildError(
        `un client avec le code ${client.chronoClient} existe deja`)
    }
    this.logger.info(`creating:${JSON.stringify(client)}...`);
    const dbClients = await this.prismaService.clients.create({data:client});
    console.log(dbClients)
    if (!dbClients) {
      return WorkDone.buildError("Aucun client n'a cette reference");
    }
    this.logger.info(dbClients);

    return WorkDone.buildOk('Le client a été créé'); 
  }

  async getClientById(chronoClient:string):Promise<WorkDone<CustomerSearchResultDto>> {
    const dbClients= await this.prismaService.clients.findUnique({
      where: {
        chronoClient: chronoClient,
      }
    });

    if (!dbClients) {
      return WorkDone.buildError("Aucun produit n'a cette reference");
    }
    return WorkDone.buildOk(dbClients);
  }

  async updateProduit(
    chronoClient: string,
    client:CustomerSearchResultDto)
  : Promise<WorkDone<CustomerSearchResultDto>> {
    //check if product with same code already exists
    //this.logger.info(code, product)
    const wd = await this.getClientById(chronoClient);
    if (!wd.isOk) {
      return wd;
    }
    this.logger.info(`modifying:${JSON.stringify(client)}...`);
    const dbClients = await this.prismaService.clients.update({
      where: { chronoClient: chronoClient },
      data: { prenom: client.prenom,
              nom:client.nom,
              codePostal:client.codePostal,
              ville:client.ville,
              dateDerniereCommande:client.dateDerniereCommande,
              codeFichierPartenaire:client.codeFichierPartenaire
      },
    });
    if (!dbClients) {
      return WorkDone.buildError("le produit n'a pas pu être modifié");
    }
    return WorkDone.buildOk(dbClients);
  }

  async deleteClient(chronoClient: string): Promise<WorkDone<string>> {
    //check if product with same code already exists
    const wd = await this.getClientById(chronoClient);
    if (!wd.isOk) {
      return WorkDone.buildError(wd.error.message);
    }
    this.logger.info(`deleting:${chronoClient}`);
    await this.prismaService.clients.delete({
      where: { chronoClient: chronoClient },
    });

    return WorkDone.buildOk('le produit a bien été supprimé');
  }
 

}
