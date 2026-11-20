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
