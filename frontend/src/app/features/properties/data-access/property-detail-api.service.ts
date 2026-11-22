import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../../../environments/environments';
import { BienDetailResponseDto } from './property-detail-response.model';

const BIENS_API_URL = `${environment.apiUrl}/api/biens`;

@Injectable({
  providedIn: 'root',
})
export class PropertyDetailApiService {
  private readonly http = inject(HttpClient);

  getById(id: number): Observable<BienDetailResponseDto> {
    return this.http.get<BienDetailResponseDto>(`${BIENS_API_URL}/${id}`);
  }
}
