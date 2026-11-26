import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideTranslateService } from '@ngx-translate/core';
import { NEVER, of, throwError } from 'rxjs';
import { Mock } from 'vitest';

import { MOCK_FAQ_CATEGORIES, MOCK_FAQ_QUESTIONS } from '../../data/faq.mock';
import { FaqQuestion, FaqSearchResult } from '../../models/faq.model';
import { FaqSearchCriteria, FaqService } from '../../data-access/faq.service';
import { FAQ_SEARCH_DEBOUNCE_MS, FaqComponent } from './faq.component';

describe('FaqComponent', () => {
  let fixture: ComponentFixture<FaqComponent>;
  let component: FaqComponent;
  let search: Mock<(criteria: FaqSearchCriteria) => ReturnType<FaqService['search']>>;

  /** Questions de la maquette et une question sans catégorie (groupe « Autres »). */
  const UNCATEGORIZED: FaqQuestion = { id: 99, categoryCode: null, question: 'Question sans catégorie', answer: 'R' };
  const ALL_QUESTIONS = [...MOCK_FAQ_QUESTIONS, UNCATEGORIZED];

  /** Fausse API conforme au contrat : les compteurs tiennent compte de la recherche, pas de la catégorie. */
  const answerFor = ({ term, category }: FaqSearchCriteria): FaqSearchResult => {
    const found = ALL_QUESTIONS.filter((item) => item.question.includes(term));
    return {
      totalCount: found.length,
      categories: MOCK_FAQ_CATEGORIES.map(({ code }) => ({
        code,
        questionCount: found.filter((item) => item.categoryCode === code).length,
      })),
      questions: category ? found.filter((item) => item.categoryCode === category) : found,
    };
  };

  const element = (): HTMLElement => fixture.nativeElement as HTMLElement;
  const items = (): number => element().querySelectorAll('app-faq-accordion-item').length;
  const groupTitles = (): string[] =>
    [...element().querySelectorAll('app-faq-question-group h2')].map((heading) => heading.textContent!.trim());
  const navButtons = (): HTMLButtonElement[] => [
    ...element().querySelectorAll<HTMLButtonElement>('.faq-category-nav__item'),
  ];
  const navCounts = (): string[] =>
    navButtons().map((button) => button.querySelector('.faq-category-nav__count')!.textContent!.trim());

  const render = async (): Promise<void> => {
    fixture.detectChanges();
    await fixture.whenStable();
  };

  beforeEach(async () => {
    search = vi.fn((criteria: FaqSearchCriteria) => of(answerFor(criteria)));

    await TestBed.configureTestingModule({
      imports: [FaqComponent],
      providers: [provideRouter([]), provideTranslateService(), { provide: FaqService, useValue: { search } }],
    }).compileComponents();

    fixture = TestBed.createComponent(FaqComponent);
    component = fixture.componentInstance;
    await render();
  });

  afterEach(() => vi.useRealTimers());

  it('affiche toutes les questions regroupées par catégorie, « Autres » en dernier', () => {
    expect(search).toHaveBeenCalledWith({ term: '', category: null });
    expect(items()).toBe(ALL_QUESTIONS.length);
    expect(groupTitles()).toEqual([
      'faq.categories.account',
      'faq.categories.searchProperty',
      'faq.categories.visitsAppointments',
      'faq.categories.publishProperty',
      'faq.categories.notariesReviews',
      'faq.otherCategory',
    ]);
    expect(element().querySelector('.faq-page__count')?.getAttribute('aria-live')).toBe('polite');
    expect(component.countKey()).toBe('faq.list.count');
  });

  it('affiche la navigation : « Toutes » active avec le total, puis les compteurs par catégorie', () => {
    expect(navCounts()).toEqual(['12', '2', '2', '2', '2', '3']);
    expect(navButtons()[0]!.getAttribute('aria-pressed')).toBe('true');
  });

  it('filtre par catégorie : un seul groupe, sans « Autres », et compteurs inchangés', async () => {
    navButtons()[5]!.click();
    await render();

    expect(search).toHaveBeenLastCalledWith({ term: '', category: 'notariesReviews' });
    expect(groupTitles()).toEqual(['faq.categories.notariesReviews']);
    expect(items()).toBe(3);
    expect(navCounts()).toEqual(['12', '2', '2', '2', '2', '3']);
    expect(navButtons()[5]!.getAttribute('aria-pressed')).toBe('true');
  });

  it('combine la recherche et la catégorie', async () => {
    component.selectedCategory.set('visitsAppointments');
    component.searchInput.set('  360 ');
    component.searchNow();
    await render();

    expect(search).toHaveBeenLastCalledWith({ term: '360', category: 'visitsAppointments' });
    expect(items()).toBe(1);
    expect(component.countKey()).toBe('faq.list.countOne');
    expect(navCounts()).toEqual(['1', '0', '0', '1', '0', '0']);
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
    expect(search).toHaveBeenCalledExactlyOnceWith({ term: '360', category: null });
  });

  it('affiche l’état « aucun résultat » et la réinitialisation remet aussi « Toutes »', async () => {
    component.selectedCategory.set('account');
    component.searchInput.set('introuvable');
    component.searchNow();
    await render();

    expect(items()).toBe(0);
    expect(component.countKey()).toBe('faq.list.countNone');
    expect(component.emptyKey()).toBe('faq.list.empty');

    element().querySelector<HTMLButtonElement>('.faq-page__action')!.click();
    await render();

    expect(component.searchInput()).toBe('');
    expect(component.selectedCategory()).toBeNull();
    expect(search).toHaveBeenLastCalledWith({ term: '', category: null });
    expect(items()).toBe(ALL_QUESTIONS.length);
  });

  it('affiche un message propre à une catégorie vide, sans recherche', async () => {
    search.mockReturnValueOnce(of({ ...answerFor({ term: '', category: null }), questions: [] }));
    component.selectedCategory.set('account');
    await render();

    expect(items()).toBe(0);
    expect(component.emptyKey()).toBe('faq.list.emptyCategory');
  });

  it('affiche un message de chargement tant que la FAQ n’est pas reçue', async () => {
    search.mockReturnValue(NEVER);
    fixture = TestBed.createComponent(FaqComponent);
    await render();

    expect(element().querySelector('.faq-page__list')?.getAttribute('aria-busy')).toBe('true');
    expect(element().querySelector('.faq-page__message')?.textContent).toContain('faq.list.loading');
    expect(element().querySelector('app-faq-category-nav')).toBeNull();
    expect(items()).toBe(0);
  });

  it('affiche une erreur avec « Réessayer », qui relance la même recherche', async () => {
    search.mockReturnValueOnce(throwError(() => new Error('API coupée')));
    fixture = TestBed.createComponent(FaqComponent);
    component = fixture.componentInstance;
    await render();

    const alert = element().querySelector('[role="alert"]');
    expect(alert?.textContent).toContain('faq.list.loadError');
    expect(element().querySelector('.faq-page__count')?.textContent?.trim()).toBe('');
    expect(items()).toBe(0);

    element().querySelector<HTMLButtonElement>('.faq-page__action')!.click();
    await render();

    expect(search).toHaveBeenLastCalledWith({ term: '', category: null });
    expect(element().querySelector('[role="alert"]')).toBeNull();
    expect(items()).toBe(ALL_QUESTIONS.length);
  });
});
