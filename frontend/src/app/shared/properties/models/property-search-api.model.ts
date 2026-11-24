/**
 * Critères de tri disponibles.
 */
export type PropertySearchSort = 'id-desc' | 'prix-asc' | 'prix-desc' | 'surface-desc';

export interface PropertySearchQuery {
  recherche?: string | null;
  localite?: string | null;
  codePostal?: string | null;

  provinceId?: number | null;
  typeTransactionId?: number | null;
  typeBienId?: number | null;
  pebBienId?: number | null;
  etatId?: number | null;

  prixMin?: number | null;
  prixMax?: number | null;

  surfaceMin?: number | null;
  surfaceMax?: number | null;

  nbChambresMin?: number | null;
  nbSdbMin?: number | null;

  garage?: boolean | null;
  parking?: boolean | null;
  jardin?: boolean | null;
  terrasse?: boolean | null;
  balcon?: boolean | null;
  ascenseur?: boolean | null;
  piscine?: boolean | null;

  tri?: PropertySearchSort;

  page?: number;
  taillePage?: number;
}

export interface PropertySearchApiItem {
  id: number;

  titre: string;
  description: string | null;

  prix: number | null;

  codePostal: string;
  localite: string;
  province: string | null;
  adresseConfidentielle: boolean;

  typeBien: string;
  typeTransaction: string;
  peb: string | null;

  surfaceHabitable: number | null;
  nombreChambres: number | null;
  nombreSallesDeBain: number | null;

  imagePrincipale: string | null;
  nombrePhotos: number;
}

export interface PropertySearchApiResponse {
  biens: PropertySearchApiItem[];

  total: number;

  page: number;

  taillePage: number;

  nombrePages: number;
}
