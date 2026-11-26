import { environment } from '../../../../../environments/environments';

import { PropertySearchApiItem } from '../models/property-search-api.model';
import { PropertySearchResult } from '../models/property-search-result.model';
import { parsePebRating } from '../models/peb-rating.model';

function mapTransactionType(type: string): 'sale' | 'rent' {
  const normalized = type.trim().toLowerCase();

  return normalized.includes('location') ? 'rent' : 'sale';
}

function mapImageUrl(path: string | null): string {
  if (!path?.trim()) {
    return '/logo/logo-immosphere.png';
  }

  const normalizedPath = path.trim();

  if (/^https?:\/\//i.test(normalizedPath)) {
    return normalizedPath;
  }

  if (normalizedPath.startsWith('/images/')) {
    return normalizedPath;
  }

  return `${environment.apiUrl}/${normalizedPath.replace(/^\/+/, '')}`;
}

export function mapPropertySearchResult(item: PropertySearchApiItem): PropertySearchResult {
  return {
    id: item.id,

    title: item.titre,
    description: item.description ?? undefined,

    price: item.prix ?? 0,

    city: item.localite,
    postalCode: item.codePostal,

    addressVisibility: 'city-only',

    imageUrl: mapImageUrl(item.imagePrincipale),

    transactionType: mapTransactionType(item.typeTransaction),

    isVisit360: false,

    peb: parsePebRating(item.peb),

    bedrooms: item.nombreChambres ?? 0,
    bathrooms: item.nombreSallesDeBain ?? 0,
    areaM2: item.surfaceHabitable ?? 0,

    photoCount: item.nombrePhotos,
  };
}
