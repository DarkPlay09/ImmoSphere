import { Injectable } from '@angular/core';
import { Observable, delay, map, of } from 'rxjs';

import { MOCK_AGENCES } from '../data/agences.mock';
import { Agence } from '../models/agence.model';
import { AgenceSearchCriteria, AgenceSearchResult } from '../models/agence-search.model';

/** Délai simulé d'un appel réseau. */
const MOCK_LATENCY_MS = 150;

/**
 * Accès aux agences. Lit pour l'instant les données factices ; les signatures
 * sont celles du futur client HTTP (`GET /api/agences`, `GET /api/agences/{id}`).
 */
@Injectable({ providedIn: 'root' })
export class AgencesService {
  search(criteria: AgenceSearchCriteria): Observable<AgenceSearchResult> {
    return of(MOCK_AGENCES).pipe(
      delay(MOCK_LATENCY_MS),
      map((agences) => searchAgences(agences, criteria)),
    );
  }

  /** Émet `null` si l'agence n'existe pas. */
  getById(id: number): Observable<Agence | null> {
    return of(MOCK_AGENCES.find((agence) => agence.id === id) ?? null).pipe(
      delay(MOCK_LATENCY_MS),
    );
  }
}

/** Filtre, trie et pagine une liste d'agences. Fonction pure, reprise côté backend plus tard. */
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
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .trim();
}
