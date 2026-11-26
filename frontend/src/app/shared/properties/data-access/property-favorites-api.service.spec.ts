import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';

import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { environment } from '../../../../../environments/environments';
import { PropertyFavoritesApiService } from './property-favorites-api.service';

describe('PropertyFavoritesApiService', () => {
  let service: PropertyFavoritesApiService;
  let httpMock: HttpTestingController;

  const apiUrl = `${environment.apiUrl}/api/favoris`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(PropertyFavoritesApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('crée le service', () => {
    expect(service).toBeTruthy();
  });

  it('récupère les identifiants des favoris', () => {
    let result: number[] = [];

    service.getFavorites().subscribe((ids) => {
      result = ids;
    });

    const request = httpMock.expectOne(apiUrl);

    expect(request.request.method).toBe('GET');
    expect(request.request.withCredentials).toBe(true);

    request.flush([1, 3, 5]);

    expect(result).toEqual([1, 3, 5]);
  });

  it('récupère le statut d’un favori', () => {
    service.getFavoriteStatus(3).subscribe((result) => {
      expect(result).toEqual({
        bienId: 3,
        isFavorite: true,
      });
    });

    const request = httpMock.expectOne(`${apiUrl}/3`);

    expect(request.request.method).toBe('GET');
    expect(request.request.withCredentials).toBe(true);

    request.flush({
      bienId: 3,
      isFavorite: true,
    });
  });

  it('ajoute un bien aux favoris', () => {
    service.addFavorite(3).subscribe();

    const request = httpMock.expectOne(`${apiUrl}/3`);

    expect(request.request.method).toBe('PUT');
    expect(request.request.body).toBeNull();
    expect(request.request.withCredentials).toBe(true);

    request.flush(null, {
      status: 204,
      statusText: 'No Content',
    });
  });

  it('retire un bien des favoris', () => {
    service.removeFavorite(3).subscribe();

    const request = httpMock.expectOne(`${apiUrl}/3`);

    expect(request.request.method).toBe('DELETE');
    expect(request.request.withCredentials).toBe(true);

    request.flush(null, {
      status: 204,
      statusText: 'No Content',
    });
  });

  it('propage une erreur d’authentification', () => {
    let errorStatus: number | undefined;

    service.getFavorites().subscribe({
      error: (error) => {
        errorStatus = error.status;
      },
    });

    const request = httpMock.expectOne(apiUrl);

    request.flush(null, {
      status: 401,
      statusText: 'Unauthorized',
    });

    expect(errorStatus).toBe(401);
  });
});
