import { Agence } from '../models/agence.model';
import { AgenceSearchCriteria, AgenceSearchResult } from '../models/agence-search.model';

/**
 * Filtre, trie et pagine une liste d'agences comme le fait `GET /api/agences`.
 * Sert aux tests qui simulent l'API à partir de `agences.mock.ts`.
 */
export function searchAgences(agences: readonly Agence[], criteria: AgenceSearchCriteria): AgenceSearchResult {
  const name = normalize(criteria.name);
  const locationTokens = normalize(criteria.location).split(/[\s,]+/).filter(Boolean);

  const filtered = agences.filter(
    (agence) =>
      (criteria.region === 'all' || agence.region === criteria.region) &&
      (!name || normalize(agence.name).includes(name)) &&
      locationTokens.every((token) =>
        [agence.city, agence.district ?? '', agence.postalCode].some((field) =>
          normalize(field).includes(token),
        ),
      ),
  );

  const sorted = sortAgences(filtered, criteria.sort);

  const pageSize = Math.max(1, criteria.pageSize);
  const pageCount = Math.max(1, Math.ceil(sorted.length / pageSize));
  const page = Math.min(Math.max(1, Math.trunc(criteria.page) || 1), pageCount);
  const start = (page - 1) * pageSize;

  return {
    items: sorted.slice(start, start + pageSize),
    total: sorted.length,
    page,
    pageCount,
  };
}

function sortAgences(agences: Agence[], sort: AgenceSearchCriteria['sort']): Agence[] {
  switch (sort) {
    case 'name':
      return [...agences].sort((a, b) => a.name.localeCompare(b.name, 'fr', { sensitivity: 'base' }));
    case 'rating':
      return [...agences].sort((a, b) => (b.rating ?? -1) - (a.rating ?? -1));
    case 'relevance':
      return agences;
  }
}

/** Minuscules sans accents, pour une recherche tolérante (« liege » trouve « Liège »). */
function normalize(value: string): string {
  return value
    .normalize('NFD')
    // Diacritiques combinants (U+0300 à U+036F) séparés de leur lettre par la décomposition NFD.
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}
