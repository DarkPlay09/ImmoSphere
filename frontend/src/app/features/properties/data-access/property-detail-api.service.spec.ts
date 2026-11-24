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
    const expectedResponse: BienDetailResponseDto = {
      id: 12,
      titre: 'Appartement lumineux',
      description: 'Un appartement proche du centre.',
      prix: 285000,
      codePostal: 4000,
      localite: 'Liège',
      province: 'Liège',
      adresseConfidentielle: false,
      rue: 'Rue des Guillemins',
      numero: 12,
      boite: '3B',
      typeBien: 'Appartement',
      typeTransaction: 'Vente',
      peb: 'B',
      images: [
        {
          url: '/images/properties/12/facade.webp',
          ordre: 1,
          texteAlternatif: 'Façade du bien',
        },
      ],
      caracteristiques: {
        anneeConstruction: 2018,
        surfaceHabitable: 95,
        surfaceTerrain: 0,
        surfaceJardin: 0,
        surfaceTerrasse: 12,
        etage: 3,
        nombreEtages: 6,
        nombreChambres: 2,
        nombreSallesDeBain: 1,
        nombreToilettes: 1,
        consommationEnergie: 112,
        numeroPeb: 'PEB-12',
        etat: 'Bon état',
        etatVente: 'Disponible',
        typeConfiguration: 'Traversant',
        typeChauffage: 'Gaz',
      },
      equipements: {
        garage: false,
        parking: true,
        jardin: false,
        balcon: true,
        cave: true,
        terrasse: true,
        grenier: false,
        ascenseur: true,
        piscine: false,
        cheminee: false,
      },
      nombreFavoris: 4,
      informationsAnnexes: ['Libre à l’acte'],
    };

    service.getById(12).subscribe((response) => {
      expect(response).toEqual({
        ...expectedResponse,
        images: [
          {
            ...expectedResponse.images[0],
            url: `${environment.apiUrl}/images/properties/12/facade.webp`,
          },
        ],
      });
    });

    const request = httpTestingController.expectOne(`${environment.apiUrl}/api/biens/12`);

    expect(request.request.method).toBe('GET');

    request.flush(expectedResponse);
  });
});
