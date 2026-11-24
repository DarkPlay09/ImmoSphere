import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../../../environments/environments';
import { FaqSearchResult } from '../models/faq.model';

const FAQ_URL = `${environment.apiUrl}/api/faq`;

/** Critères de consultation de la FAQ ; une valeur vide n'est pas envoyée. */
export interface FaqSearchCriteria {
  term: string;
  /** Code de la catégorie choisie, ou `null` pour toutes les catégories. */
  category: string | null;
}

/**
 * Accès à la FAQ via l'API (`GET /api/faq`). La recherche (question et réponse, sans tenir
 * compte de la casse ni des accents), le filtre par catégorie, les compteurs et le tri sont faits par le back.
 */
@Injectable({ providedIn: 'root' })
export class FaqService {
  private readonly http = inject(HttpClient);

  /** Sans critère, renvoie toute la FAQ ; les erreurs HTTP (400, 500, réseau) sont propagées. */
  search({ term, category }: FaqSearchCriteria): Observable<FaqSearchResult> {
    let params = new HttpParams();
    const search = term.trim();
    if (search) params = params.set('search', search);
    if (category) params = params.set('category', category);
    return this.http.get<FaqSearchResult>(FAQ_URL, { params });
  }
}
