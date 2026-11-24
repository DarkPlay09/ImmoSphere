import { inject, Injectable } from '@angular/core';

import { HttpClient, HttpParams } from '@angular/common/http';

import { Observable } from 'rxjs';

import { environment } from '../../../../../environments/environments';

import { PropertySearchApiResponse, PropertySearchQuery } from '../models/property-search-api.model';


/**
 * Service responsable de la recherche immobilière auprès du backend.
 */
@Injectable({
  providedIn: 'root',
})
export class PropertySearchService {
  private readonly http = inject(HttpClient);

  private readonly apiUrl = `${environment.apiUrl}/api/biens`;

  /**
   * Recherche les biens immobiliers.
   *
   * Les critères sont transmis dans l'URL sous forme de paramètres HTTP.
   */
  search(query: PropertySearchQuery = {}): Observable<PropertySearchApiResponse> {
    let params = new HttpParams();

    // Convertir les critères en paramètres HTTP.
    for (const [key, value] of Object.entries(query)) {
      if (value === null || value === undefined) {
        continue;
      }

      const normalizedValue = typeof value === 'string' ? value.trim() : value;

      if (normalizedValue === '') {
        continue;
      }

      params = params.set(key, String(normalizedValue));
    }

    return this.http.get<PropertySearchApiResponse>(this.apiUrl, { params });
  }
}
