import { Property } from './property.model';

export interface PropertySearchResult extends Property {
  description?: string;

  photoCount?: number;
  photoIndex?: number;

  specialBadge?: string;

  extraFeatures?: string[];

  financialNote?: string;
  advertiserName?: string;
}
