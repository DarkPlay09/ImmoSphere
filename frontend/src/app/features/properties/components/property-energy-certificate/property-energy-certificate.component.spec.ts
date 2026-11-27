import { provideTranslateService } from '@ngx-translate/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BienDetailResponseDto } from '../../data-access/property-detail-response.model';
import { PropertyEnergyCertificateComponent } from './property-energy-certificate.component';

const PROPERTY: BienDetailResponseDto = {
  id: 1,
  titre: 'Appartement',
  description: 'Description',
  prix: 200000,
  codePostal: 4000,
  localite: 'Liège',
  province: 'Liège',
  adresseConfidentielle: false,
  rue: 'Rue Saint-Gilles',
  numero: 1,
  boite: null,
  typeBien: 'Appartement',
  typeTransaction: 'Vente',
  peb: 'B',
  images: [],
  caracteristiques: {
    anneeConstruction: 2000,
    surfaceHabitable: 90,
    surfaceTerrain: 0,
    surfaceJardin: 0,
    surfaceTerrasse: 0,
    etage: 2,
    nombreEtages: 4,
    nombreChambres: 2,
    nombreSallesDeBain: 1,
    nombreToilettes: 1,
    consommationEnergie: 142,
    numeroPeb: '20231108018942',
    etat: 'Bon état',
    etatVente: 'Disponible',
    typeConfiguration: 'Traversant',
    typeChauffage: 'Gaz',
  },
  equipements: {
    garage: false,
    parking: false,
    jardin: false,
    balcon: false,
    cave: false,
    terrasse: false,
    grenier: false,
    ascenseur: true,
    piscine: false,
    cheminee: false,
  },
  nombreFavoris: 0,
  informationsAnnexes: [],
};

describe('PropertyEnergyCertificateComponent', () => {
  let fixture: ComponentFixture<PropertyEnergyCertificateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PropertyEnergyCertificateComponent],
      providers: [provideTranslateService()],
    }).compileComponents();

    fixture = TestBed.createComponent(PropertyEnergyCertificateComponent);
  });

  it('affiche les informations énergétiques fournies par le bien', () => {
    fixture.componentRef.setInput('property', PROPERTY);
    fixture.detectChanges();

    const element = fixture.nativeElement as HTMLElement;

    expect(fixture.componentInstance.certificateNumber()).toBe(
      PROPERTY.caracteristiques.numeroPeb,
    );
    expect(fixture.componentInstance.consumption()).toBe(
      PROPERTY.caracteristiques.consommationEnergie,
    );
    expect(element.querySelectorAll('.energy-certificate__scale-step--active')).toHaveLength(1);
  });

  it('masque les informations absentes au lieu de les inventer', () => {
    fixture.componentRef.setInput('property', {
      ...PROPERTY,
      caracteristiques: {
        ...PROPERTY.caracteristiques,
        numeroPeb: '',
        consommationEnergie: 0,
      },
    });
    fixture.detectChanges();

    const element = fixture.nativeElement as HTMLElement;

    expect(element.querySelector('.energy-certificate__header p')).toBeNull();
    expect(element.querySelector('.energy-certificate__metrics')).toBeNull();
  });
});
