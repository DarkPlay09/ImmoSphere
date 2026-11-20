import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { Subject, debounceTime, distinctUntilChanged, map, merge, startWith, switchMap, tap } from 'rxjs';

import { FaqAccordionItemComponent } from '../../../shared/faq/components/faq-accordion-item/faq-accordion-item.component';
import { FaqContactBannerComponent } from '../../../shared/faq/components/faq-contact-banner/faq-contact-banner.component';
import { FaqSearchBarComponent } from '../../../shared/faq/components/faq-search-bar/faq-search-bar.component';
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

  /** Texte réellement recherché, après le délai de saisie. */
  readonly appliedTerm = signal('');

  readonly questions = toSignal(
    merge(
      toObservable(this.searchInput).pipe(debounceTime(FAQ_SEARCH_DEBOUNCE_MS)),
      this.immediateSearch,
    ).pipe(
      startWith(''),
      map((term) => term.trim()),
      distinctUntilChanged(),
      tap((term) => this.appliedTerm.set(term)),
      // `switchMap` annule la recherche précédente quand une nouvelle commence.
      switchMap((term) => this.faqService.search(term)),
    ),
    { initialValue: [] },
  );

  readonly count = computed(() => this.questions().length);

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
}
