export interface BienDetailResponseDto {
  id: number;
  titre: string;
  description: string;
  prix: number;

  codePostal: number;
  localite: string;
  province: string;

  adresseConfidentielle: boolean;
  rue: string | null;
  numero: number | null;
  boite: string | null;

  typeBien: string;
  typeTransaction: string;
  peb: string;

  images: readonly ImageBienResponseDto[];
  caracteristiques: CaracteristiquesBienResponseDto;
  equipements: EquipementsBienResponseDto;

  nombreFavoris: number;
  informationsAnnexes: readonly string[];
}

export interface ImageBienResponseDto {
  url: string;
  ordre: number;
  texteAlternatif: string;
}

export interface CaracteristiquesBienResponseDto {
  anneeConstruction: number;
  surfaceHabitable: number;
  surfaceTerrain: number;
  surfaceJardin: number;
  surfaceTerrasse: number;

  etage: number;
  nombreEtages: number;
  nombreChambres: number;
  nombreSallesDeBain: number;
  nombreToilettes: number;

  consommationEnergie: number;
  numeroPeb: string;

  etat: string;
  etatVente: string;
  typeConfiguration: string;
  typeChauffage: string;
}

export interface EquipementsBienResponseDto {
  garage: boolean;
  parking: boolean;
  jardin: boolean;
  balcon: boolean;
  cave: boolean;
  terrasse: boolean;
  grenier: boolean;
  ascenseur: boolean;
  piscine: boolean;
  cheminee: boolean;
}
