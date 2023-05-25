import {
  LoggerService,
  PrismaService,
} from '@formation/servers-lib/dist/services';
import { convertDbPartenaireToCodeLabelResultDto } from '@formation/servers-lib/dist/utils/prisma-dto-converters';
import {
  CodeLabelResultDto,
  IPaginatedListDto,
  ISearchDto,
  OffreReferenceResultDto,
  ProductDto,
  SearchProductDto,
  WorkDone,
} from '@formation/shared-lib';
import { Body, Injectable } from '@nestjs/common';
import { orderBy } from 'lodash';

@Injectable()
export class RefsService {
  /*getProductListByCriterias //   {
    (): WorkDone<IPaginatedListDto<ProductDto>> | PromiseLike<WorkDone<IPaginatedListDto<ProductDto>>> {
      
      throw new Error('Method not implemented.')
  }*/

  constructor(
    private readonly logger: LoggerService,
    private readonly prismaService: PrismaService,
  ) {
    this.logger.info('RefsService created');
  }

  async getAllFichParts(): Promise<WorkDone<CodeLabelResultDto[]>> {
    const dbPartenaires = await this.prismaService.partenaire.findMany({
      orderBy: {
        code: 'asc',
      },
    });

    if (!dbPartenaires) {
      return WorkDone.buildError(
        'Une erreur est survenue durant la récupération des partenaires.',
      );
    }
    return WorkDone.buildOk<CodeLabelResultDto[]>(
      dbPartenaires.map(convertDbPartenaireToCodeLabelResultDto),
    );
  }

  async searchOffreReference(
    codeCampagne: number,
    codeOffre?: string,
    codeProduit?: string,
  ): Promise<WorkDone<OffreReferenceResultDto[]>> {
    return WorkDone.buildOk([
      {
        codeCampagne: 202201,
        codeOffre: 'OF01',
        libelleOffre: 'Offre #01',
        codeProduit: 'PR01',
        dateDerniereModification: new Date(),
      },
      {
        codeCampagne: 202201,
        codeOffre: 'OF01',
        libelleOffre: 'Offre #01',
        codeProduit: 'PR02',
        dateDerniereModification: new Date(),
      },
      {
        codeCampagne: 202201,
        codeOffre: 'OF02',
        libelleOffre: 'Offre #02',
        codeProduit: 'PR07',
        dateDerniereModification: new Date(),
      },
    ]);
    
  }

  async updateOffreReferenceDateDerniereModification(
    offreReference: OffreReferenceResultDto,
  ): Promise<WorkDone<OffreReferenceResultDto>> {
    // await this.oracleDbService.executeQuery<number>(
    //   `UPDATE ADLMASTER_OWNER.OFFRE_REFERENCE
    //    SET DT_MODI = CURRENT_DATE
    //    WHERE CD_CAMP = :codeCampagne
    //      AND CD_OFFRREFE = :codeOffre`,
    //   {
    //     queryBindings: {
    //       codeCampagne: { dir: ORACLE_BIND_IN, type: DB_TYPE_NUMBER, val: offreReference.codeCampagne },
    //       codeOffre: { dir: ORACLE_BIND_IN, type: DB_TYPE_VARCHAR, val: offreReference.codeOffre }
    //     },
    //     isTransaction: true
    //   })
    //
    // const newOffreReference = await this.searchOffreReference(offreReference.codeCampagne, offreReference.codeOffre)
    //
    // if (newOffreReference.isOk && newOffreReference.data) {
    //   return (newOffreReference.data.length > 0) ? WorkDone.buildOk(newOffreReference.data[0]) : WorkDone.buildError(`Update date in Offre Reference error
    // !`) } else { return WorkDone.toError(newOffreReference) }
    return WorkDone.buildOk(offreReference);
  }

  /* async getProducts(searchTerm: string): Promise<WorkDone<ProductDto[]>> {
    //const filter = '%voile%'
    const dbProducts = await this.prismaService.produit.findMany({
      where: {
        libelle: {
          contains: searchTerm,
          mode: 'insensitive',
        },
      },
      orderBy: {
        libelle: 'asc',
      },
    });
    

    if (!dbProducts) {
      return WorkDone.buildError(
        'une erreur est survenue durant la recuperation des produits',
      );
    }
    return WorkDone.buildOk(dbProducts);
  } */

  async getProduitByCode(code: string): Promise<WorkDone<ProductDto>> {
    const dbProducts = await this.prismaService.produit.findUnique({
      where: {
        code: code,
      },
    });

    if (!dbProducts) {
      return WorkDone.buildError("Aucun produit n'a cette reference");
    }
    return WorkDone.buildOk(dbProducts);
  }

  async createProduit(product: ProductDto): Promise<WorkDone<ProductDto>> {
    //check if product with same code already exists
    if ((await this.getProduitByCode(product.code)).isOk) {
      return WorkDone.buildError(
        `un produit avec le code ${product.code} existe déjà`,
      );
    }

    this.logger.info(`creating:${JSON.stringify(product)}...`);
    const dbProducts = await this.prismaService.produit.create({
      data: product,
    });
    if (!dbProducts) {
      return WorkDone.buildError("Aucun produit n'a cette reference");
    }
    this.logger.info(dbProducts);
    return WorkDone.buildOk(dbProducts);
  }

  async updateProduit(
    code: string,
    product: ProductDto,
  ): Promise<WorkDone<ProductDto>> {
    //check if product with same code already exists
    //this.logger.info(code, product)
    const wd = await this.getProduitByCode(code);
    if (!wd.isOk) {
      return wd;
    }
    this.logger.info(`modifying:${JSON.stringify(product)}...`);
    const dbProducts = await this.prismaService.produit.update({
      where: { code: code },
      data: { libelle: product.libelle },
    });
    if (!dbProducts) {
      return WorkDone.buildError("le produit n'a pas pu être modifié");
    }
    return WorkDone.buildOk(dbProducts);
  }

  async deleteProduit(code: string): Promise<WorkDone<string>> {
    //check if product with same code already exists
    const wd = await this.getProduitByCode(code);
    if (!wd.isOk) {
      return WorkDone.buildError(wd.error.message);
    }
    this.logger.info(`deleting:${code}`);
    await this.prismaService.produit.delete({
      where: { code: code },
    });

    return WorkDone.buildOk('le produit a bien été supprimé');
  }

  async getProductListByCriterias(
    searchCriterias: ISearchDto<SearchProductDto>,
  ): Promise<WorkDone<ProductDto[]>> {
    this.logger.info('test');
    this.logger.info(searchCriterias);
    const dbProducts = await this.prismaService.produit.findMany({
      where: {
        libelle: {
          contains: searchCriterias.criterias.labelLike,
          mode: 'insensitive',
        },

        code: {
          startsWith: searchCriterias.criterias.codeLike,
          mode: 'insensitive',
        },
      },

      include: {
        _count: true
      },
      orderBy: {
        libelle: 'asc',
      },
      take: 10,
    });

    return WorkDone.buildOk(dbProducts);
  }

  async getListProduits(): Promise<WorkDone<ProductDto[]>> {

    const dbProducts = await this.prismaService.produit.findMany({
      orderBy: {
        libelle: 'asc',
      },
    });


    if (!dbProducts) {
      return WorkDone.buildError(
        'une erreur est survenue durant la recuperation des produits',
      );
    }
    return WorkDone.buildOk(dbProducts);
  }
}

/* SELECT p.code, p.libelle, COUNT(o.code) AS nombre_offres
FROM ref_produits p
LEFT JOIN ref_offres o ON p.code = o.code_produit
GROUP BY p.code, p.libelle; */


