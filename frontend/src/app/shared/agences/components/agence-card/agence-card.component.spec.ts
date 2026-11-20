import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideTranslateService } from '@ngx-translate/core';

import { MOCK_AGENCES } from '../../data/agences.mock';
import { Agence } from '../../models/agence.model';
import { AgenceCardComponent } from './agence-card.component';

describe('AgenceCardComponent', () => {
  let fixture: ComponentFixture<AgenceCardComponent>;

  const render = async (agence: Agence): Promise<HTMLElement> => {
    fixture.componentRef.setInput('agence', agence);
    fixture.detectChanges();
    await fixture.whenStable();
    return fixture.nativeElement as HTMLElement;
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AgenceCardComponent],
      providers: [provideRouter([]), provideTranslateService()],
    }).compileComponents();

    fixture = TestBed.createComponent(AgenceCardComponent);
  });

  it('affiche le nom, la localité et le lien vers le profil', async () => {
    const element = await render(MOCK_AGENCES[0]!);

    expect(element.querySelector('.agence-card__name')?.textContent).toContain('Horizon Immo Liège');
    expect(element.querySelector('.agence-card__location')?.textContent).toContain('Liège · Quai de la Meuse & Centre');
    expect(element.querySelector('.agence-card__button--primary')?.getAttribute('href')).toBe('/agences/1');
  });

  it('affiche un placeholder quand le logo est absent', async () => {
    const element = await render({ ...MOCK_AGENCES[0]!, logoUrl: undefined });

    expect(element.querySelector('.agence-card__logo--placeholder')?.textContent?.trim()).toBe('H');
    expect(element.querySelector('img.agence-card__logo')).toBeNull();
  });

  it('affiche le logo quand il est fourni', async () => {
    const element = await render({ ...MOCK_AGENCES[0]!, logoUrl: '/logo.png' });

    expect(element.querySelector('img.agence-card__logo')?.getAttribute('src')).toBe('/logo.png');
  });

  it('masque la note, les avis et les biens quand ils ne sont pas fournis', async () => {
    const element = await render({
      ...MOCK_AGENCES[0]!,
      rating: undefined,
      reviewCount: undefined,
      propertyCount: undefined,
    });

    expect(element.querySelector('.agence-card__stats')).toBeNull();
    expect(element.querySelector('.agence-card__button--muted')).toBeNull();
  });

  it('masque la ligne et le bouton « biens en vente » quand l’API renvoie 0 bien sans avis', async () => {
    const element = await render({ ...MOCK_AGENCES[0]!, rating: undefined, reviewCount: undefined, propertyCount: 0 });

    expect(element.querySelector('.agence-card__stats')).toBeNull();
    expect(element.querySelector('.agence-card__button--muted')).toBeNull();
  });

  it('n’affiche que les biens disponibles quand il n’y a pas d’avis', async () => {
    const element = await render({ ...MOCK_AGENCES[0]!, rating: undefined, reviewCount: undefined, propertyCount: 3 });

    expect(element.querySelector('.agence-card__stats')).not.toBeNull();
    expect(element.querySelector('.agence-card__reviews')).toBeNull();
    expect(element.querySelector('.agence-card__available')).not.toBeNull();
    expect(element.querySelector('.agence-card__button--muted')).not.toBeNull();
  });

  it('masque le bouton Contacter sans adresse e-mail', async () => {
    const element = await render({ ...MOCK_AGENCES[0]!, email: undefined });

    expect(element.querySelector('.agence-card__button--ghost')).toBeNull();
  });

  it('propose un lien mailto: vers l’agence, avec un libellé accessible traduit', async () => {
    const element = await render(MOCK_AGENCES[0]!);
    const contact = element.querySelector<HTMLAnchorElement>('.agence-card__button--ghost')!;

    expect(contact.tagName).toBe('A');
    expect(contact.getAttribute('href')).toBe('mailto:contact@horizon-immo-liege.be');
    expect(contact.getAttribute('aria-label')).toBe('agences.contact.label');
  });

  it('encode l’adresse dans le lien mailto:', async () => {
    const element = await render({ ...MOCK_AGENCES[0]!, email: 'jean+agence@exemple.be' });

    expect(element.querySelector('.agence-card__button--ghost')?.getAttribute('href')).toBe(
      'mailto:jean%2Bagence@exemple.be',
    );
  });

  it('le lien Contacter ne mène pas au profil ; seul « Voir l’agence » y mène', async () => {
    const element = await render(MOCK_AGENCES[0]!);
    const contact = element.querySelector('.agence-card__button--ghost')!;

    expect(contact.getAttribute('href')).not.toContain('/agences');
    expect(contact.closest('a[href^="/agences"]')).toBeNull();
    expect(element.querySelector('.agence-card__button--primary')?.getAttribute('href')).toBe('/agences/1');
  });
});
