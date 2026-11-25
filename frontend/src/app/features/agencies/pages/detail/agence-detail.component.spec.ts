import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, provideRouter } from '@angular/router';
import { provideTranslateService } from '@ngx-translate/core';
import { of, throwError } from 'rxjs';

import { MOCK_AGENCES } from '../../../../shared/agences/data/agences.mock';
import { Agence } from '../../../../shared/agences/models/agence.model';
import { AgencesService } from '../../../../shared/agences/services/agences.service';
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

describe('AgenceDetailComponent — éléments optionnels', () => {
  /** Jeu de données complet : tous les champs optionnels renseignés. */
  const complete: Agence = MOCK_AGENCES[0]!;

  /** Même agence sans aucun champ optionnel, avec un seul paragraphe de présentation. */
  const minimal: Agence = {
    ...complete,
    district: undefined,
    ipiNumber: undefined,
    federiaMember: undefined,
    openingHours: undefined,
    about: [complete.about![0]!],
    highlights: undefined,
    rating: undefined,
    reviewCount: undefined,
    propertyCount: undefined,
  };

  const render = async (agence: Agence): Promise<{ element: HTMLElement; detectChanges: () => void }> => {
    await TestBed.configureTestingModule({
      imports: [AgenceDetailComponent],
      providers: [
        provideRouter([]),
        provideTranslateService(),
        { provide: AgencesService, useValue: { getById: () => of(agence) } },
        { provide: ActivatedRoute, useValue: { paramMap: of(convertToParamMap({ id: String(agence.id) })) } },
      ],
    }).compileComponents();

    const fixture = TestBed.createComponent(AgenceDetailComponent);
    fixture.detectChanges();
    await fixture.whenStable();
    return { element: fixture.nativeElement as HTMLElement, detectChanges: () => fixture.detectChanges() };
  };

  describe('jeu de données complet', () => {
    let element: HTMLElement;

    beforeEach(async () => {
      ({ element } = await render(complete));
    });

    it('affiche les badges IPI et Federia', () => {
      expect(element.querySelector('.agence-header__badge--ipi')?.textContent).toContain('agences.detail.ipiNumber');
      expect(element.querySelector('.agence-header__badge--federia')).not.toBeNull();
    });

    it('affiche le quartier dans la localisation', () => {
      expect(element.querySelector('.agence-header__location')?.textContent).toContain('Quai de la Meuse & Centre');
    });

    it('affiche les horaires d’ouverture', () => {
      expect(element.textContent).toContain('agences.detail.hours');
      expect(element.textContent).toContain('agences.detail.hoursLine');
    });

    it('affiche les trois points forts et les deux paragraphes de présentation', () => {
      expect(element.querySelectorAll('.agence-about__highlight')).toHaveLength(3);
      expect(element.querySelectorAll('.agence-about__text p')).toHaveLength(2);
      expect(element.querySelectorAll('.agence-about__text p')[1]?.textContent).toContain('vérification approfondie');
    });

    it('affiche la note, cinq étoiles (dont une demie) et le nombre d’avis', () => {
      expect(element.querySelector('.agence-header__rating-number')?.textContent).toContain('4,7');
      expect(element.querySelectorAll('.agence-header__star')).toHaveLength(5);
      expect(element.querySelectorAll('.agence-header__star--filled')).toHaveLength(5);
      expect([...element.querySelectorAll('.agence-header__star')].map((star) => star.textContent?.trim())).toEqual([
        'star', 'star', 'star', 'star', 'star_half',
      ]);
      expect(element.querySelector('.agence-header__reviews')?.textContent).toContain('agences.detail.reviews');
    });

    it('place la note au-dessus du bouton Contacter l’agence', () => {
      const side = element.querySelector('.agence-header__side')!;
      const rating = side.querySelector('.agence-header__rating')!;
      const contact = side.querySelector('.agence-header__button')!;

      expect(rating.compareDocumentPosition(contact) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    });
  });

  describe('jeu de données minimal', () => {
    let element: HTMLElement;

    beforeEach(async () => {
      ({ element } = await render(minimal));
    });

    it('masque les badges IPI et Federia', () => {
      expect(element.querySelector('.agence-header__badge--ipi')).toBeNull();
      expect(element.querySelector('.agence-header__badge--federia')).toBeNull();
    });

    it('masque le quartier, les horaires et les points forts', () => {
      expect(element.querySelector('.agence-header__location')?.textContent).not.toContain('·');
      expect(element.textContent).not.toContain('agences.detail.hours');
      expect(element.querySelector('.agence-about__highlights')).toBeNull();
    });

    it('n’affiche qu’un paragraphe de présentation', () => {
      expect(element.querySelectorAll('.agence-about__text p')).toHaveLength(1);
    });

    it('masque le bloc de note sans note ni avis', () => {
      expect(element.querySelector('.agence-header__rating')).toBeNull();
      expect(element.querySelector('.agence-header__button')).not.toBeNull();
    });
  });

  it('affiche le profil sans région, sans texte vide', async () => {
    const { element } = await render({ ...complete, region: undefined });

    expect(element.querySelector('.agence-header__name')?.textContent).toContain('Horizon Immo Liège');
    expect(element.querySelector('.agence-header__location')?.textContent).toContain('Liège');
    expect(element.textContent).not.toContain('undefined');
  });

  it('masque le bloc de note si le nombre d’avis manque', async () => {
    const { element } = await render({ ...complete, reviewCount: undefined });

    expect(element.querySelector('.agence-header__rating')).toBeNull();
  });

  it('bascule le favori localement au clic', async () => {
    const { element, detectChanges } = await render(complete);
    const favorite = element.querySelector<HTMLButtonElement>('.agence-header__favorite')!;

    expect(favorite.getAttribute('aria-pressed')).toBe('false');
    expect(favorite.getAttribute('aria-label')).toBe('agences.detail.favoriteAdd');

    favorite.click();
    detectChanges();

    expect(favorite.getAttribute('aria-pressed')).toBe('true');
    expect(favorite.classList).toContain('agence-header__favorite--active');
    expect(favorite.getAttribute('aria-label')).toBe('agences.detail.favoriteRemove');
  });
});

describe('AgenceDetailComponent — contact par e-mail', () => {
  const render = async (agence: Agence): Promise<HTMLElement> => {
    await TestBed.configureTestingModule({
      imports: [AgenceDetailComponent],
      providers: [
        provideRouter([]),
        provideTranslateService(),
        { provide: AgencesService, useValue: { getById: () => of(agence) } },
        { provide: ActivatedRoute, useValue: { paramMap: of(convertToParamMap({ id: String(agence.id) })) } },
      ],
    }).compileComponents();

    const fixture = TestBed.createComponent(AgenceDetailComponent);
    fixture.detectChanges();
    await fixture.whenStable();
    return fixture.nativeElement as HTMLElement;
  };

  it('le bouton « Contacter l’agence » est un lien mailto: avec un libellé accessible', async () => {
    const element = await render(MOCK_AGENCES[0]!);
    const contact = element.querySelector<HTMLAnchorElement>('.agence-header__button')!;

    expect(contact.tagName).toBe('A');
    expect(contact.getAttribute('href')).toBe('mailto:contact@horizon-immo-liege.be');
    expect(contact.getAttribute('aria-label')).toBe('agences.contact.label');
  });

  it('masque le bouton « Contacter l’agence » sans adresse e-mail', async () => {
    const element = await render({ ...MOCK_AGENCES[0]!, email: undefined });

    expect(element.querySelector('.agence-header__button')).toBeNull();
    expect(element.querySelector('a[href^="mailto:"]')).toBeNull();
  });
});
