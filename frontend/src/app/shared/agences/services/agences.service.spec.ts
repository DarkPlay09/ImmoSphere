import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';

import { environment } from '../../../../../environments/environments';
import { MOCK_AGENCES } from '../data/agences.mock';
import { AgenceSearchResult, DEFAULT_AGENCE_SEARCH } from '../models/agence-search.model';
import { AgencesService } from './agences.service';

describe('AgencesService', () => {
  const url = `${environment.apiUrl}/api/agences`;
  let service: AgencesService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideHttpClient(), provideHttpClientTesting()] });
    service = TestBed.inject(AgencesService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('appelle GET /api/agences avec les critères par défaut', async () => {
    const response: AgenceSearchResult = { items: [MOCK_AGENCES[0]!], total: 1, page: 1, pageCount: 1 };
    const result = firstValueFrom(service.search(DEFAULT_AGENCE_SEARCH));

    const request = http.expectOne((req) => req.url === url);
    expect(request.request.method).toBe('GET');
    expect(request.request.params.toString()).toBe('sort=relevance&page=1&pageSize=6');
    request.flush(response);

    expect(await result).toEqual(response);
  });

  it('envoie nom, localisation, région, tri et page renseignés (texte trimé)', () => {
    service
      .search({ ...DEFAULT_AGENCE_SEARCH, name: ' horizon ', location: 'Liège, 4000', region: 'wallonia', sort: 'rating', page: 2 })
      .subscribe();

    const params = http.expectOne((req) => req.url === url).request.params;
    expect(params.get('name')).toBe('horizon');
    expect(params.get('location')).toBe('Liège, 4000');
    expect(params.get('region')).toBe('wallonia');
    expect(params.get('sort')).toBe('rating');
    expect(params.get('page')).toBe('2');
  });

  it('n’envoie pas la région « all » ni les recherches vides', () => {
    service.search({ ...DEFAULT_AGENCE_SEARCH, name: '   ' }).subscribe();

    const params = http.expectOne((req) => req.url === url).request.params;
    expect(params.has('name')).toBe(false);
    expect(params.has('location')).toBe(false);
    expect(params.has('region')).toBe(false);
  });

  it('propage les erreurs de la recherche', async () => {
    const result = firstValueFrom(service.search(DEFAULT_AGENCE_SEARCH));

    http
      .expectOne((req) => req.url === url)
      .flush({ code: 'INVALID_PAGE', message: 'Page invalide' }, { status: 400, statusText: 'Bad Request' });

    await expect(result).rejects.toMatchObject({ status: 400 });
  });

  it('renvoie une agence par son identifiant, champs absents laissés à undefined', async () => {
    const { rating, reviewCount, ...agenceSansAvis } = MOCK_AGENCES[0]!;
    const result = firstValueFrom(service.getById(1));

    http.expectOne(`${url}/1`).flush(agenceSansAvis);

    const agence = await result;
    expect(agence?.name).toBe('Horizon Immo Liège');
    expect(agence?.rating).toBeUndefined();
    expect(agence?.reviewCount).toBeUndefined();
  });

  it('renvoie null pour une 404 AGENCE_NOT_FOUND', async () => {
    const result = firstValueFrom(service.getById(999));

    http
      .expectOne(`${url}/999`)
      .flush({ code: 'AGENCE_NOT_FOUND', message: 'Introuvable' }, { status: 404, statusText: 'Not Found' });

    expect(await result).toBeNull();
  });

  it('propage une 404 sans le code AGENCE_NOT_FOUND', async () => {
    const result = firstValueFrom(service.getById(1));

    http.expectOne(`${url}/1`).flush(null, { status: 404, statusText: 'Not Found' });

    await expect(result).rejects.toMatchObject({ status: 404 });
  });

  it('propage les erreurs serveur et réseau du profil', async () => {
    const serverError = firstValueFrom(service.getById(1));
    http.expectOne(`${url}/1`).flush(null, { status: 500, statusText: 'Server Error' });
    await expect(serverError).rejects.toMatchObject({ status: 500 });

    const networkError = firstValueFrom(service.getById(2));
    http.expectOne(`${url}/2`).error(new ProgressEvent('error'));
    await expect(networkError).rejects.toMatchObject({ status: 0 });
  });
});
