import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../../../environments/environments';
import { FaqQuestion } from '../models/faq.model';

const FAQ_URL = `${environment.apiUrl}/api/faq`;

/**
 * Accès à la FAQ via l'API (`GET /api/faq`). La recherche (question et réponse, sans tenir
 * compte de la casse ni des accents) et le tri sont faits par le back.
 */
@Injectable({ providedIn: 'root' })
export class FaqService {
  private readonly http = inject(HttpClient);

  /** Une recherche vide renvoie toute la FAQ ; les erreurs HTTP sont propagées. */
  search(term: string): Observable<FaqQuestion[]> {
    const search = term.trim();
    const params = search ? new HttpParams().set('search', search) : undefined;
    return this.http.get<FaqQuestion[]>(FAQ_URL, { params });
  }
}
