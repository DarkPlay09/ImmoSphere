import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../../../environments/environments';

import { PropertyFavoriteIds, PropertyFavoriteStatus } from '../models/property-favorite.model';

@Injectable({
  providedIn: 'root',
})
export class PropertyFavoritesApiService {
  private readonly http = inject(HttpClient);

  private readonly apiUrl = `${environment.apiUrl}/api/favoris`;

  getFavorites(): Observable<PropertyFavoriteIds> {
    return this.http.get<PropertyFavoriteIds>(this.apiUrl, {
      withCredentials: true,
    });
  }

  getFavoriteStatus(propertyId: number): Observable<PropertyFavoriteStatus> {
    return this.http.get<PropertyFavoriteStatus>(`${this.apiUrl}/${propertyId}`, {
      withCredentials: true,
    });
  }

  addFavorite(propertyId: number): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${propertyId}`, null, {
      withCredentials: true,
    });
  }

  removeFavorite(propertyId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${propertyId}`, {
      withCredentials: true,
    });
  }
}
