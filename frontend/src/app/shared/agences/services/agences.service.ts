import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, of, throwError } from 'rxjs';

import { environment } from '../../../../../environments/environments';
import { Agence } from '../models/agence.model';
import { AgenceSearchCriteria, AgenceSearchResult } from '../models/agence-search.model';

const AGENCES_URL = `${environment.apiUrl}/api/agences`;

/** Code renvoyé par `GET /api/agences/{id}` quand l'agence n'existe pas. */
const AGENCE_NOT_FOUND = 'AGENCE_NOT_FOUND';

/**
 * Accès aux agences via l'API (`GET /api/agences`, `GET /api/agences/{id}`).
 * Les champs optionnels absents du JSON restent `undefined`, comme le modèle les décrit.
 */
@Injectable({ providedIn: 'root' })
export class AgencesService {
  private readonly http = inject(HttpClient);

  search(criteria: AgenceSearchCriteria): Observable<AgenceSearchResult> {
    return this.http.get<AgenceSearchResult>(AGENCES_URL, { params: toSearchParams(criteria) });
  }

  /** Émet `null` si l'agence n'existe pas (404 `AGENCE_NOT_FOUND`) ; les autres erreurs sont propagées. */
  getById(id: number): Observable<Agence | null> {
    return this.http
      .get<Agence>(`${AGENCES_URL}/${id}`)
      .pipe(catchError((error: unknown) => (isAgenceNotFound(error) ? of(null) : throwError(() => error))));
  }
}

/** Paramètres de requête attendus par le back ; les critères vides ou par défaut sont omis. */
function toSearchParams(criteria: AgenceSearchCriteria): HttpParams {
  let params = new HttpParams()
    .set('sort', criteria.sort)
    .set('page', criteria.page)
    .set('pageSize', criteria.pageSize);

  const name = criteria.name.trim();
  const location = criteria.location.trim();

  if (name) {
    params = params.set('name', name);
  }
  if (location) {
    params = params.set('location', location);
  }
  if (criteria.region !== 'all') {
    params = params.set('region', criteria.region);
  }

  return params;
}

function isAgenceNotFound(error: unknown): boolean {
  return (
    error instanceof HttpErrorResponse &&
    error.status === 404 &&
    (error.error as { code?: unknown } | null)?.code === AGENCE_NOT_FOUND
  );
}

/**
 * Filtre, trie et pagine une liste d'agences, comme le fait le back.
 * N'est plus utilisée par le service : conservée pour les tests qui simulent l'API
 * à partir de `agences.mock.ts` (liste des agences).
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
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .trim();
}
