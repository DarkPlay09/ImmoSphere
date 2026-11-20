import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import { MOCK_FAQ_QUESTIONS } from '../data/faq.mock';
import { FaqQuestion } from '../models/faq.model';

/**
 * Accès aux questions de la FAQ. Données factices en attendant `GET /api/faq` :
 * la recherche porte sur la question et la réponse, sans tenir compte de la casse ni des accents.
 */
@Injectable({ providedIn: 'root' })
export class FaqService {
  search(term: string): Observable<FaqQuestion[]> {
    const normalizedTerm = normalize(term);
    return of(
      MOCK_FAQ_QUESTIONS.filter(
        (item) =>
          !normalizedTerm ||
          normalize(item.question).includes(normalizedTerm) ||
          normalize(item.answer).includes(normalizedTerm),
      ),
    );
  }
}

/** Minuscules sans accents (« peb » trouve « PEB », « 360 » trouve « 360° »). */
function normalize(value: string): string {
  return value
    .normalize('NFD')
    // Diacritiques combinants (U+0300 à U+036F) séparés de leur lettre par la décomposition NFD.
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .trim();
}
