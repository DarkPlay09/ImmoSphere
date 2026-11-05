export interface Property {
  id: number;
  title: string;
  price: number;

  address?: string;
  city: string;
  postalCode: string;
  addressVisibility: AddressVisibility;

  imageUrl: string;
  transactionType: TransactionType;
  isVisit360: boolean;
  peb?: PebRating;

  bedrooms: number;
  bathrooms: number;
  areaM2: number;
}

export type AddressVisibility = 'full' | 'city-only';
export type TransactionType = 'sale' | 'rent';
export type PebRating = 'A' | 'B' | 'C' | 'D' | 'E' | 'F';
