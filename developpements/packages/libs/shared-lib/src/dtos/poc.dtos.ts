export interface SearchCustomerByChronoClientDto {
  chronoClient: string
  codeFichierPartenaire: string,
}

export interface SearchCustomerDto {
  chronoClient?: string,
  codeFichierPartenaire: string,
  codePostal?: string,
  dateDerniereCommandeFrom?: Date,
  dateDerniereCommandeTo?: Date
  nom?: string,
  prenom?: string,
  ville?: string,
  actif?:boolean,
 
}

export interface CustomerSearchResultDto {
  chronoClient: string,
  codeFichierPartenaire: string,
  codePostal: string,
  dateDerniereCommande: Date
  nom: string,
  prenom: string,
  ville: string,
  actif:boolean,
}

export interface CodeLabelResultDto {
  code: string,
  label: string
}

export interface OffreReferenceResultDto {
  codeCampagne: number,
  codeOffre: string,
  codeProduit: string,
  dateDerniereModification: Date
  libelleOffre: string,
}

export interface ProductDto{

    code: string,
    libelle:string
    commentaires?:string

}

export interface SearchProductDto{
  labelLike: string,
  codeLike:string,
  codepostalLike:string 
}
export interface SearchShopDto {
  labelLike: string;
  codeLike: string;
  codepostalLike:string
}

export interface ShopDto {
  code: string;
  nom: string;
  ville?: string;
  codepostal?: string;
}
