export interface PropertySearchOption {
  id: number;
  libelle: string;
}

export interface PropertySearchOptionsResponse {
  typesBiens: PropertySearchOption[];

  typesTransactions: PropertySearchOption[];

  pebs: PropertySearchOption[];

  etats: PropertySearchOption[];

  provinces: PropertySearchOption[];
}
