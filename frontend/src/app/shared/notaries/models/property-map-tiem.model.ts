import { PebRating } from '../../properties/models/peb-rating.model';

export type BelgiumRegion = 'brussels' | 'flanders' | 'wallonia';

export type PropertyMapKind = 'penthouse' | 'apartment' | 'villa' | 'house';

export interface PropertyMapItem {
  id: number;
  price: number;

  city: string;
  postalCode: string;
  region: BelgiumRegion;

  latitude: number;
  longitude: number;

  kind: PropertyMapKind;
  imageUrl: string;
  peb?: PebRating;
}
