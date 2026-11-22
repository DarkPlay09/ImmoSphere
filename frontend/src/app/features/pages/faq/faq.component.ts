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

import { FaqAccordionItemComponent } from '../../../shared/faq/components/faq-accordion-item/faq-accordion-item.component';
import { FaqContactBannerComponent } from '../../../shared/faq/components/faq-contact-banner/faq-contact-banner.component';
import { FaqSearchBarComponent } from '../../../shared/faq/components/faq-search-bar/faq-search-bar.component';
import { FaqQuestion } from '../../../shared/faq/models/faq.model';
import { FaqService } from '../../../shared/faq/services/faq.service';

/** Délai entre la dernière frappe et le lancement de la recherche. */
export const FAQ_SEARCH_DEBOUNCE_MS = 300;

/** Page publique de la FAQ (UC7) : recherche et liste des questions en accordéon. */
@Component({
  selector: 'app-faq',
  standalone: true,
  imports: [
    FaqAccordionItemComponent,
    FaqContactBannerComponent,
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

  readonly questions = toSignal(
    combineLatest([this.terms$, this.retryRequests.pipe(startWith(undefined))]).pipe(
      // `switchMap` annule la recherche précédente quand une nouvelle commence.
      switchMap(([term]) => this.load(term)),
    ),
    { initialValue: [] },
  );

  readonly count = computed(() => this.questions().length);

  /**
   * Contenu de la liste : erreur, premier chargement (rien à afficher encore) ou questions.
   * Pendant une nouvelle recherche, les questions précédentes restent affichées en transparence.
   */
  readonly listState = computed<'error' | 'loading' | 'ready'>(() => {
    if (this.error()) return 'error';
    return this.loading() && this.count() === 0 ? 'loading' : 'ready';
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

  searchNow(): void {
    this.immediateSearch.next(this.searchInput());
  }

  resetSearch(): void {
    this.searchInput.set('');
    this.immediateSearch.next('');
  }

  retry(): void {
    this.retryRequests.next();
  }

  private load(term: string): Observable<FaqQuestion[]> {
    this.loading.set(true);
    this.error.set(false);
    return this.faqService.search(term).pipe(
      catchError(() => {
        this.error.set(true);
        return of([]);
      }),
      finalize(() => this.loading.set(false)),
    );
  }
}
