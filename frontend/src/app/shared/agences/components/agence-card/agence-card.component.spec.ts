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

  it('masque le bouton Contacter sans adresse e-mail', async () => {
    const element = await render({ ...MOCK_AGENCES[0]!, email: undefined });

    expect(element.querySelector('.agence-card__button--ghost')).toBeNull();
  });
});
