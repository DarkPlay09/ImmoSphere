export type PropertyTransactionType = 'sale' | 'rent';

export interface PropertySearchFilters {
  transactionType: PropertyTransactionType;
  location: string;
  propertyType: string;
  budgetMax: number | null;
  bedrooms: number | null;
  minArea: number | null;
  peb: string | null;
}
