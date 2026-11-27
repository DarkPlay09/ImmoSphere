import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { map, Observable } from 'rxjs';

import { environment } from '../../../../../environments/environments';
import { BienDetailResponseDto } from './property-detail-response.model';

const BIENS_API_URL = `${environment.apiUrl}/api/biens`;

@Injectable({
  providedIn: 'root',
})
export class PropertyDetailApiService {
  private readonly http = inject(HttpClient);

  getById(id: number): Observable<BienDetailResponseDto> {
    return this.http.get<BienDetailResponseDto>(`${BIENS_API_URL}/${id}`).pipe(
      map((property) => ({
        ...property,
        images: property.images.map((image) => ({
          ...image,
          url: this.toAbsoluteImageUrl(image.url),
        })),
      })),
    );
  }

  private toAbsoluteImageUrl(url: string): string {
    if (/^https?:\/\//i.test(url)) {
      return url;
    }

    return `${environment.apiUrl}${url.startsWith('/') ? '' : '/'}${url}`;
  }
}
