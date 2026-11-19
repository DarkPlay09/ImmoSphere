import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, provideRouter } from '@angular/router';
import { provideTranslateService } from '@ngx-translate/core';
import { of, throwError } from 'rxjs';

import { MOCK_AGENCES } from '../../../shared/agences/data/agences.mock';
import { AgencesService } from '../../../shared/agences/services/agences.service';
import { AgenceDetailComponent } from './agence-detail.component';

describe('AgenceDetailComponent', () => {
  // Service synchrone pour les tests, sans délai simulé.
  const agencesServiceStub = {
    getById: (id: number) => of(MOCK_AGENCES.find((agence) => agence.id === id) ?? null),
  };

  const render = async (id: string): Promise<HTMLElement> => {
    await TestBed.configureTestingModule({
      imports: [AgenceDetailComponent],
      providers: [
        provideRouter([]),
        provideTranslateService(),
        { provide: AgencesService, useValue: agencesServiceStub },
        { provide: ActivatedRoute, useValue: { paramMap: of(convertToParamMap({ id })) } },
      ],
    }).compileComponents();

    const fixture: ComponentFixture<AgenceDetailComponent> = TestBed.createComponent(AgenceDetailComponent);
    fixture.detectChanges();
    await fixture.whenStable();
    return fixture.nativeElement as HTMLElement;
  };

  it('affiche le profil d’une agence existante', async () => {
    const element = await render('1');

    expect(element.querySelector('.agence-header__name')?.textContent).toContain('Horizon Immo Liège');
    expect(element.querySelector('.agence-detail__breadcrumb-current')?.textContent).toContain('Horizon Immo Liège');
    expect(element.querySelectorAll('.agence-header__badge')).toHaveLength(3);
    expect(element.querySelectorAll('.agence-about__highlight')).toHaveLength(3);
    expect(element.querySelectorAll('.agence-specs__language')).toHaveLength(3);
    expect(element.textContent).toContain('Quai de la Meuse 48, 4000 Liège');
    expect(element.querySelector('.agence-contact__link--phone')?.getAttribute('href')).toBe('tel:+3242205870');
  });

  it('masque les informations absentes', async () => {
    // Agence 7 : ni site, ni horaires, ni Federia, ni « À propos ».
    const element = await render('7');

    expect(element.querySelector('.agence-header__badge--federia')).toBeNull();
    expect(element.querySelector('.agence-about__highlights')).toBeNull();
    expect(element.querySelector('a[target="_blank"]')).toBeNull();
    // La description courte remplace le texte « À propos ».
    expect(element.querySelector('.agence-about__text')?.textContent).toContain('Agence familiale du Brabant wallon');
  });

  it('affiche un message clair pour une agence inconnue', async () => {
    const element = await render('999');

    expect(element.querySelector('.agence-detail__not-found')).not.toBeNull();
    expect(element.querySelector('.agence-detail__not-found a')?.getAttribute('href')).toBe('/agences');
  });

  it('traite un identifiant non numérique comme introuvable', async () => {
    const element = await render('abc');

    expect(element.querySelector('.agence-detail__not-found')).not.toBeNull();
  });
});

describe('AgenceDetailComponent en cas d’erreur', () => {
  it('affiche un message d’erreur si le chargement échoue', async () => {
    await TestBed.configureTestingModule({
      imports: [AgenceDetailComponent],
      providers: [
        provideRouter([]),
        provideTranslateService(),
        { provide: AgencesService, useValue: { getById: () => throwError(() => new Error('réseau')) } },
        { provide: ActivatedRoute, useValue: { paramMap: of(convertToParamMap({ id: '1' })) } },
      ],
    }).compileComponents();

    const fixture = TestBed.createComponent(AgenceDetailComponent);
    fixture.detectChanges();
    await fixture.whenStable();

    const element = fixture.nativeElement as HTMLElement;
    expect(element.querySelector('.agence-detail__status[role="alert"]')?.textContent).toContain('agences.loadError');
    expect(element.querySelector('.agence-detail__not-found')).toBeNull();
  });
});
