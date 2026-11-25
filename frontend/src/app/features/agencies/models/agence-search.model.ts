import { Agence, AgenceRegion } from './agence.model';

/** Critères de la page liste. Préfigure les paramètres de `GET /api/agences`. */
export interface AgenceSearchCriteria {
  /** Recherche dans le nom de l'agence. */
  name: string;
  /** Ville, quartier ou code postal (« Liège », « 4000 », « Liège, 4000 »). */
  location: string;
  region: AgenceRegion | 'all';
  sort: AgenceSort;
  /** Page demandée, à partir de 1. */
  page: number;
  pageSize: number;
}

/**
 * - `relevance` : ordre renvoyé par la source (le futur backend décidera du classement) ;
 * - `name` : ordre alphabétique ;
 * - `rating` : meilleure note d'abord, agences sans note en dernier.
 */
export type AgenceSort = 'relevance' | 'name' | 'rating';

export interface AgenceSearchResult {
  items: Agence[];
  /** Nombre total d'agences qui correspondent aux critères. */
  total: number;
  /** Page réellement renvoyée (ramenée dans les bornes). */
  page: number;
  pageCount: number;
}

export const AGENCES_PAGE_SIZE = 6;

export const DEFAULT_AGENCE_SEARCH: AgenceSearchCriteria = {
  name: '',
  location: '',
  region: 'all',
  sort: 'relevance',
  page: 1,
  pageSize: AGENCES_PAGE_SIZE,
};
