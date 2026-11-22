import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { environment } from '../../../../../environments/environments';
import { PropertyDetailApiService } from './property-detail-api.service';
import { BienDetailResponseDto } from './property-detail-response.model';

describe('PropertyDetailApiService', () => {
  let service: PropertyDetailApiService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(PropertyDetailApiService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('récupère le détail d’un bien par son identifiant', () => {
    const expectedResponse = {
      id: 12,
    } as BienDetailResponseDto;

    service.getById(12).subscribe((response) => {
      expect(response).toEqual(expectedResponse);
    });

    const request = httpTestingController.expectOne(`${environment.apiUrl}/api/biens/12`);

    expect(request.request.method).toBe('GET');

    request.flush(expectedResponse);
  });
});
