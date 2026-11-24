import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';

import { environment } from '../../../../../environments/environments';
import { MOCK_FAQ_CATEGORIES, MOCK_FAQ_RESULT } from '../data/faq.mock';
import { FaqSearchResult } from '../models/faq.model';
import { FaqService } from './faq.service';

describe('FaqService', () => {
  const url = `${environment.apiUrl}/api/faq`;
  let service: FaqService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideHttpClient(), provideHttpClientTesting()] });
    service = TestBed.inject(FaqService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('appelle GET /api/faq sans paramètre quand il n’y a ni recherche ni catégorie', async () => {
    const result = firstValueFrom(service.search({ term: '   ', category: null }));

    const request = http.expectOne((req) => req.url === url);
    expect(request.request.method).toBe('GET');
    expect(request.request.params.keys()).toEqual([]);
    request.flush(MOCK_FAQ_RESULT);

    expect(await result).toEqual(MOCK_FAQ_RESULT);
  });

  it('envoie la recherche trimée, accents compris', () => {
    service.search({ term: '  visite 360° ', category: null }).subscribe();

    const params = http.expectOne((req) => req.url === url).request.params;
    expect(params.get('search')).toBe('visite 360°');
    expect(params.has('category')).toBe(false);
  });

  it('envoie la catégorie choisie, avec ou sans recherche', () => {
    service.search({ term: '', category: 'account' }).subscribe();
    const categoryOnly = http.expectOne((req) => req.url === url).request.params;
    expect(categoryOnly.keys()).toEqual(['category']);
    expect(categoryOnly.get('category')).toBe('account');

    service.search({ term: 'mot de passe', category: 'account' }).subscribe();
    const both = http.expectOne((req) => req.url === url).request.params;
    expect(both.get('search')).toBe('mot de passe');
    expect(both.get('category')).toBe('account');
  });

  it('renvoie les compteurs même quand aucune question ne correspond', async () => {
    const empty: FaqSearchResult = { totalCount: 0, categories: MOCK_FAQ_CATEGORIES, questions: [] };
    const result = firstValueFrom(service.search({ term: 'hypothèque inversée', category: null }));

    http.expectOne((req) => req.url === url).flush(empty);

    expect(await result).toEqual(empty);
  });

  it('propage les erreurs de validation, serveur et réseau', async () => {
    const tooLong = firstValueFrom(service.search({ term: 'a'.repeat(101), category: null }));
    http
      .expectOne((req) => req.url === url)
      .flush({ code: 'SEARCH_TOO_LONG', message: 'Trop long' }, { status: 400, statusText: 'Bad Request' });
    await expect(tooLong).rejects.toMatchObject({ status: 400 });

    const unknownCategory = firstValueFrom(service.search({ term: '', category: 'inconnue' }));
    http
      .expectOne((req) => req.url === url)
      .flush({ code: 'FAQ_CATEGORY_UNKNOWN', message: 'Inconnue' }, { status: 400, statusText: 'Bad Request' });
    await expect(unknownCategory).rejects.toMatchObject({ status: 400 });

    const networkError = firstValueFrom(service.search({ term: '', category: null }));
    http.expectOne((req) => req.url === url).error(new ProgressEvent('error'));
    await expect(networkError).rejects.toMatchObject({ status: 0 });
  });
});
