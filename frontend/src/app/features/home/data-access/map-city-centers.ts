import { BelgiumRegion } from '../../../shared/notaries/models/property-map-tiem.model';

export interface MapCityCenter {
  latitude: number;
  longitude: number;
  region: BelgiumRegion;
}

/**
 * Positions approximatives des centres de communes.
 *
 * IMPORTANT :
 * Ces coordonnées ne correspondent PAS aux adresses
 * exactes des annonces immobilières.
 */
const CITY_CENTERS: Record<string, MapCityCenter> = {
  liege: {
    latitude: 50.6326,
    longitude: 5.5797,
    region: 'wallonia',
  },
  seraing: {
    latitude: 50.5836,
    longitude: 5.5011,
    region: 'wallonia',
  },
  huy: {
    latitude: 50.518,
    longitude: 5.2324,
    region: 'wallonia',
  },
  waremme: {
    latitude: 50.6977,
    longitude: 5.2558,
    region: 'wallonia',
  },
  spa: {
    latitude: 50.4926,
    longitude: 5.8646,
    region: 'wallonia',
  },
  verviers: {
    latitude: 50.5939,
    longitude: 5.8662,
    region: 'wallonia',
  },
  namur: {
    latitude: 50.4669,
    longitude: 4.8675,
    region: 'wallonia',
  },
  mons: {
    latitude: 50.4542,
    longitude: 3.9523,
    region: 'wallonia',
  },
  charleroi: {
    latitude: 50.4108,
    longitude: 4.4446,
    region: 'wallonia',
  },
  waterloo: {
    latitude: 50.7147,
    longitude: 4.3991,
    region: 'wallonia',
  },
  wavre: {
    latitude: 50.7167,
    longitude: 4.6167,
    region: 'wallonia',
  },
  bruxelles: {
    latitude: 50.8503,
    longitude: 4.3517,
    region: 'brussels',
  },
  brussel: {
    latitude: 50.8503,
    longitude: 4.3517,
    region: 'brussels',
  },
  leuven: {
    latitude: 50.8798,
    longitude: 4.7005,
    region: 'flanders',
  },
  haacht: {
    latitude: 50.977,
    longitude: 4.635,
    region: 'flanders',
  },
};

export function normalizeCity(city: string): string {
  return city
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}

export function getMapCityCenter(city: string): MapCityCenter | null {
  return CITY_CENTERS[normalizeCity(city)] ?? null;
}
