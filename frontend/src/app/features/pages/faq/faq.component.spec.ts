import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideTranslateService } from '@ngx-translate/core';
import { of } from 'rxjs';
import { Mock } from 'vitest';

import { MOCK_FAQ_QUESTIONS } from '../../../shared/faq/data/faq.mock';
import { FaqQuestion } from '../../../shared/faq/models/faq.model';
import { FaqService } from '../../../shared/faq/services/faq.service';
import { FAQ_SEARCH_DEBOUNCE_MS, FaqComponent } from './faq.component';

describe('FaqComponent', () => {
  let fixture: ComponentFixture<FaqComponent>;
  let component: FaqComponent;
  let search: Mock<(term: string) => ReturnType<FaqService['search']>>;

  const VISIT_360 = MOCK_FAQ_QUESTIONS[5]!;

  // Réponses simulées de l'API : « 360 » trouve une question, « introuvable » aucune.
  const answerFor = (term: string): FaqQuestion[] => {
    if (!term) return MOCK_FAQ_QUESTIONS;
    return term === '360' ? [VISIT_360] : [];
  };

  const element = (): HTMLElement => fixture.nativeElement as HTMLElement;
  const items = (): number => element().querySelectorAll('app-faq-accordion-item').length;

  const render = async (): Promise<void> => {
    fixture.detectChanges();
    await fixture.whenStable();
  };

  beforeEach(async () => {
    search = vi.fn((term: string) => of(answerFor(term)));

    await TestBed.configureTestingModule({
      imports: [FaqComponent],
      providers: [provideRouter([]), provideTranslateService(), { provide: FaqService, useValue: { search } }],
    }).compileComponents();

    fixture = TestBed.createComponent(FaqComponent);
    component = fixture.componentInstance;
    await render();
  });

  afterEach(() => vi.useRealTimers());

  it('affiche toutes les questions au chargement, avec leur nombre', () => {
    expect(search).toHaveBeenCalledWith('');
    expect(items()).toBe(MOCK_FAQ_QUESTIONS.length);
    expect(element().querySelector('.faq-page__count')?.getAttribute('aria-live')).toBe('polite');
    expect(component.countKey()).toBe('faq.list.count');
  });

  it('cherche immédiatement au clic sur Rechercher (texte trimé)', async () => {
    component.searchInput.set('  360 ');
    component.searchNow();
    await render();

    expect(search).toHaveBeenLastCalledWith('360');
    expect(items()).toBe(1);
    expect(component.countKey()).toBe('faq.list.countOne');
  });

  it('attend la fin de la saisie avant de chercher', () => {
    // Composant recréé sous faux timers : le délai de la valeur initiale ne doit pas partir en temps réel.
    fixture.destroy();
    vi.useFakeTimers();
    fixture = TestBed.createComponent(FaqComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    vi.advanceTimersByTime(FAQ_SEARCH_DEBOUNCE_MS);
    search.mockClear();

    component.searchInput.set('360');
    // Exécute l'effet de `toObservable`, qui transmet la nouvelle saisie.
    TestBed.tick();

    vi.advanceTimersByTime(FAQ_SEARCH_DEBOUNCE_MS - 1);
    expect(search).not.toHaveBeenCalled();

    vi.advanceTimersByTime(1);
    expect(search).toHaveBeenCalledExactlyOnceWith('360');
  });

  it('affiche l’état « aucun résultat » et réinitialise la recherche', async () => {
    component.searchInput.set('introuvable');
    component.searchNow();
    await render();

    expect(items()).toBe(0);
    expect(component.countKey()).toBe('faq.list.countNone');

    element().querySelector<HTMLButtonElement>('.faq-page__reset')!.click();
    await render();

    expect(component.searchInput()).toBe('');
    expect(items()).toBe(MOCK_FAQ_QUESTIONS.length);
  });
});
