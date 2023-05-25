import { LoggerService } from '@formation/servers-lib/dist/services'
import { AbstractController } from '@formation/servers-lib/dist/utils'
import {
  CustomerSearchResultDto,
  IPaginatedListDto,
  ISearchDto,
  SearchCustomerDto,
  WorkDone
} from '@formation/shared-lib'
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query
} from '@nestjs/common'
import { CustomersService } from './customers.service'
import { ApiBody } from '@nestjs/swagger'
import { get } from 'lodash'


@Controller('customers')
export class CustomersController extends AbstractController {

  constructor (
    private readonly logger: LoggerService,
    private readonly customersService: CustomersService
  ) {
    super()
    this.logger.info('CustomersController created')
  }

  @Get('/search/one')
  async findOne (@Query('codeFichierPartenaire') codeFichierPartenaire: string, @Query('chronoClient') chronoClient: string): Promise<WorkDone<CustomerSearchResultDto>> {
    return this.customersService.findOne(codeFichierPartenaire, chronoClient)
  }
  @Get('client/:chronoClient')
  async getClientById(@Param('chronoClient') chronoClient:string):Promise<WorkDone<CustomerSearchResultDto>> {
    return this.customersService.getClientById(chronoClient)
  }

 /*  @Get('/search/multi-criterias')
  async searchCustomer (@Query() queryParams: ISearchDto<SearchCustomerDto>): Promise<WorkDone<IPaginatedListDto<CustomerSearchResultDto>>> {
    const criterias = CustomersController.parseSearchDtoFromQuery<SearchCustomerDto>(queryParams)
    this.logger.debug(JSON.stringify(criterias))
    return this.customersService.searchCustomer(criterias)
  } */

  @Get('/search/multi-criterias')
  async searchCustomer (@Query() queryParams: ISearchDto<SearchCustomerDto>): Promise<WorkDone<IPaginatedListDto<CustomerSearchResultDto>>> {
    const criterias = CustomersController.parseSearchDtoFromQuery<SearchCustomerDto>(queryParams)
    //this.logger.debug(JSON.stringify(criterias))
    return this.customersService.searchCustomer(criterias)
  }
  
  @Post('/client')
  @ApiBody({})
  async createClient(@Body() client:CustomerSearchResultDto): Promise<WorkDone<string>>{
    return this.customersService.createClient(client)
  }

  @Put('/client/:chronoClient')
  @ApiBody({})
  async updateProduit(@Param('chronoClient') chronoClient: string,
    @Body() client:CustomerSearchResultDto): Promise<WorkDone<CustomerSearchResultDto>> {
    //this.logger.info(product)
    return this.customersService.updateProduit(chronoClient, client);
  }

  @Delete('/client/:chronoClient')
  async deleteClient(@Param('chronoClient') chronoClient:string): Promise<WorkDone<string>>{
    return this.customersService.deleteClient(chronoClient)
  }
}
