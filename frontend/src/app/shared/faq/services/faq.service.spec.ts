import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';

import { environment } from '../../../../../environments/environments';
import { MOCK_FAQ_QUESTIONS } from '../data/faq.mock';
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

  it('appelle GET /api/faq sans paramètre quand la recherche est vide', async () => {
    const result = firstValueFrom(service.search('   '));

    const request = http.expectOne((req) => req.url === url);
    expect(request.request.method).toBe('GET');
    expect(request.request.params.keys()).toEqual([]);
    request.flush(MOCK_FAQ_QUESTIONS);

    expect(await result).toEqual(MOCK_FAQ_QUESTIONS);
  });

  it('envoie la recherche trimée, accents compris', () => {
    service.search('  visite 360° ').subscribe();

    const params = http.expectOne((req) => req.url === url).request.params;
    expect(params.get('search')).toBe('visite 360°');
  });

  it('renvoie une liste vide quand rien ne correspond', async () => {
    const result = firstValueFrom(service.search('hypothèque inversée'));

    http.expectOne((req) => req.url === url).flush([]);

    expect(await result).toEqual([]);
  });

  it('propage les erreurs de validation, serveur et réseau', async () => {
    const tooLong = firstValueFrom(service.search('a'.repeat(101)));
    http
      .expectOne((req) => req.url === url)
      .flush({ code: 'SEARCH_TOO_LONG', message: 'Trop long' }, { status: 400, statusText: 'Bad Request' });
    await expect(tooLong).rejects.toMatchObject({ status: 400 });

    const networkError = firstValueFrom(service.search(''));
    http.expectOne((req) => req.url === url).error(new ProgressEvent('error'));
    await expect(networkError).rejects.toMatchObject({ status: 0 });
  });
});
