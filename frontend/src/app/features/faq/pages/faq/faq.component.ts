import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import {
  Observable,
  Subject,
  catchError,
  combineLatest,
  debounceTime,
  distinctUntilChanged,
  finalize,
  map,
  merge,
  of,
  startWith,
  switchMap,
  tap,
} from 'rxjs';

import { FaqCategoryNavComponent } from '../../../shared/faq/components/faq-category-nav/faq-category-nav.component';
import { FaqContactBannerComponent } from '../../../shared/faq/components/faq-contact-banner/faq-contact-banner.component';
import { FaqQuestionGroupComponent } from '../../../shared/faq/components/faq-question-group/faq-question-group.component';
import { FaqSearchBarComponent } from '../../../shared/faq/components/faq-search-bar/faq-search-bar.component';
import { FaqSearchResult } from '../../../shared/faq/models/faq.model';
import { FaqSearchCriteria, FaqService } from '../../data-access/faq.service';
import { groupFaqQuestions } from '../../../shared/faq/utils/group-faq-questions';

/** Délai entre la dernière frappe et le lancement de la recherche. */
export const FAQ_SEARCH_DEBOUNCE_MS = 300;

/**
 * Page publique de la FAQ (UC7) : recherche, navigation par catégorie et questions en accordéon
 * regroupées par catégorie. La recherche et la catégorie restent locales (pas dans l'URL).
 */
@Component({
  selector: 'app-faq',
  standalone: true,
  imports: [
    FaqCategoryNavComponent,
    FaqContactBannerComponent,
    FaqQuestionGroupComponent,
    FaqSearchBarComponent,
    RouterLink,
    TranslatePipe,
  ],
  templateUrl: './faq.component.html',
  styleUrl: './faq.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FaqComponent {
  private readonly faqService = inject(FaqService);

  /** Texte saisi dans la barre de recherche. */
  readonly searchInput = signal('');

  /** Catégorie choisie dans la navigation (`null` : toutes). */
  readonly selectedCategory = signal<string | null>(null);

  /** Recherche immédiate (bouton « Rechercher », réinitialisation), sans attendre le délai de saisie. */
  private readonly immediateSearch = new Subject<string>();

  /** Relance la dernière recherche après une erreur (bouton « Réessayer »). */
  private readonly retryRequests = new Subject<void>();

  /** Texte réellement recherché, après le délai de saisie. */
  readonly appliedTerm = signal('');

  readonly loading = signal(true);

  /** Vrai si le dernier chargement a échoué (réseau, 400, 500…). */
  readonly error = signal(false);

  private readonly terms$ = merge(
    toObservable(this.searchInput).pipe(debounceTime(FAQ_SEARCH_DEBOUNCE_MS)),
    this.immediateSearch,
  ).pipe(
    startWith(''),
    map((term) => term.trim()),
    distinctUntilChanged(),
    tap((term) => this.appliedTerm.set(term)),
  );

  /** Dernière réponse de l'API, ou `null` avant la première réponse et après une erreur. */
  readonly result = toSignal(
    combineLatest([
      this.terms$,
      toObservable(this.selectedCategory),
      this.retryRequests.pipe(startWith(undefined)),
    ]).pipe(
      // `switchMap` annule la recherche précédente quand une nouvelle commence.
      switchMap(([term, category]) => this.load({ term, category })),
    ),
    { initialValue: null },
  );

  readonly categories = computed(() => this.result()?.categories ?? []);

  readonly totalCount = computed(() => this.result()?.totalCount ?? 0);

  readonly groups = computed(() => groupFaqQuestions(this.result()?.questions ?? [], this.categories()));

  /** Nombre de questions affichées (recherche et catégorie comprises). */
  readonly count = computed(() => this.result()?.questions.length ?? 0);

  /**
   * Contenu de la liste : erreur, premier chargement (rien à afficher encore) ou questions.
   * Pendant une nouvelle recherche, les questions précédentes restent affichées en transparence.
   */
  readonly listState = computed<'error' | 'loading' | 'ready'>(() => {
    if (this.error()) return 'error';
    return this.loading() && this.result() === null ? 'loading' : 'ready';
  });

  /** Clé de traduction du nombre de résultats (singulier, pluriel ou aucun). */
  readonly countKey = computed(() => {
    switch (this.count()) {
      case 0:
        return 'faq.list.countNone';
      case 1:
        return 'faq.list.countOne';
      default:
        return 'faq.list.count';
    }
  });

  /** Message de l'état vide : avec le texte recherché, ou pour une catégorie sans question. */
  readonly emptyKey = computed(() => (this.appliedTerm() ? 'faq.list.empty' : 'faq.list.emptyCategory'));

  searchNow(): void {
    this.immediateSearch.next(this.searchInput());
  }

  /** Efface la recherche et revient à « Toutes les questions ». */
  resetSearch(): void {
    this.searchInput.set('');
    this.selectedCategory.set(null);
    this.immediateSearch.next('');
  }

  retry(): void {
    this.retryRequests.next();
  }

  private load(criteria: FaqSearchCriteria): Observable<FaqSearchResult | null> {
    this.loading.set(true);
    this.error.set(false);
    return this.faqService.search(criteria).pipe(
      catchError(() => {
        this.error.set(true);
        return of(null);
      }),
      finalize(() => this.loading.set(false)),
    );
  }
}
