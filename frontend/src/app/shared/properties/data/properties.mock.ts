import { Property } from '../models/property.model';

export const MOCK_PROPERTIES: Property[] = [
  {
    id: 1,
    title: 'Appartement lumineux avec grande terrasse',
    price: 285000,

    address: 'Quai de liège 46',
    city: 'Liège',
    postalCode: '4000',
    addressVisibility: 'city-only',

    imageUrl: '/images/properties/appartement_lumineux.jpg',
    transactionType: 'sale',
    isVisit360: true,
    peb: 'B',

    bedrooms: 2,
    bathrooms: 1,
    areaM2: 92,
  }
];
