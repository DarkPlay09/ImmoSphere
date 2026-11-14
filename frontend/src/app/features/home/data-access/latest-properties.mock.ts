import { Property } from '../../../shared/properties/models/property.model';
import { MOCK_PROPERTIES } from '../../../shared/properties/data/properties.mock';

export interface LatestProperties extends Property {
  isNew: boolean;
}

export const LATEST_PROPERTIES: LatestProperties[] = [
  {
    ...MOCK_PROPERTIES[0]!,
    imageUrl: './images/home/selections/appartement.png',
    isNew: true,
  },
  {
    id: 2,
    title: 'Villa contemporaine',
    price: 645000,
    city: 'Namur',
    postalCode: '5000',
    addressVisibility: 'city-only',
    imageUrl: '/images/home/selections/villa.png',
    transactionType: 'sale',
    isVisit360: false,
    peb: 'A',
    bedrooms: 4,
    bathrooms: 2,
    areaM2: 240,
    isNew: true,
  },
  {
    id: 3,
    title: 'Maison de caractère',
    price: 340000,
    city: 'Bruxelles',
    postalCode: '1050',
    addressVisibility: 'city-only',
    imageUrl: '/images/home/selections/maison.png',
    transactionType: 'sale',
    isVisit360: true,
    peb: 'C',
    bedrooms: 3,
    bathrooms: 1,
    areaM2: 165,
    isNew: false,
  },
  {
    id: 4,
    title: 'Duplex moderne rénové',
    price: 1250,
    city: 'Leuven',
    postalCode: '3000',
    addressVisibility: 'city-only',
    imageUrl: '/images/home/selections/duplex.png',
    transactionType: 'rent',
    isVisit360: false,
    peb: 'B',
    bedrooms: 2,
    bathrooms: 1,
    areaM2: 88,
    isNew: false,
  },
];
