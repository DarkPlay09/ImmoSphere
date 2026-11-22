import { inject, Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { environment } from '../../../../../environments/environments';

import { PropertySearchOptionsResponse } from '../models/property-search-options.model';

@Injectable({
  providedIn: 'root',
})
export class PropertySearchOptionsService {
  private readonly http = inject(HttpClient);

  private readonly apiUrl = `${environment.apiUrl}/api/biens/filtres`;

  getOptions(): Observable<PropertySearchOptionsResponse> {
    return this.http.get<PropertySearchOptionsResponse>(this.apiUrl);
  }
}
