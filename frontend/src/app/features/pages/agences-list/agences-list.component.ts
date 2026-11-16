import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  computed,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { TranslatePipe } from '@ngx-translate/core';
import { finalize, switchMap } from 'rxjs';

import { AgenceCardComponent } from '../../../shared/agences/components/agence-card/agence-card.component';
import { AgenceRegion } from '../../../shared/agences/models/agence.model';
import {
  AgenceSearchCriteria,
  AgenceSort,
  DEFAULT_AGENCE_SEARCH,
} from '../../../shared/agences/models/agence-search.model';
import { AgencesService } from '../../../shared/agences/services/agences.service';
import { AgencesPaginationComponent } from './components/agences-pagination/agences-pagination.component';
import { AgencesProBannerComponent } from './components/agences-pro-banner/agences-pro-banner.component';
import { AgencesSearchFormComponent } from './components/agences-search-form/agences-search-form.component';

@Component({
  selector: 'app-agences-list',
  standalone: true,
  imports: [
    AgenceCardComponent,
    AgencesPaginationComponent,
    AgencesProBannerComponent,
    AgencesSearchFormComponent,
    TranslatePipe,
  ],
  templateUrl: './agences-list.component.html',
  styleUrl: './agences-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AgencesListComponent {
  private readonly agencesService = inject(AgencesService);

  private readonly resultsTop = viewChild<ElementRef<HTMLElement>>('resultsTop');

  readonly sorts: AgenceSort[] = ['relevance', 'name', 'rating'];

  // Champs du formulaire : appliqués seulement au clic sur « Rechercher ».
  readonly nameInput = signal('');
  readonly locationInput = signal('');
  readonly regionInput = signal<AgenceRegion | 'all'>('all');

  /** Critères réellement appliqués à la recherche. */
  readonly criteria = signal<AgenceSearchCriteria>(DEFAULT_AGENCE_SEARCH);

  readonly loading = signal(true);

  readonly result = toSignal(
    toObservable(this.criteria).pipe(
      switchMap((criteria) => {
        this.loading.set(true);
        return this.agencesService.search(criteria).pipe(finalize(() => this.loading.set(false)));
      }),
    ),
  );

  readonly agences = computed(() => this.result()?.items ?? []);
  readonly total = computed(() => this.result()?.total ?? 0);
  readonly page = computed(() => this.result()?.page ?? 1);
  readonly pageCount = computed(() => this.result()?.pageCount ?? 1);

  readonly hasActiveFilters = computed(() => {
    const { name, location, region } = this.criteria();
    return name !== '' || location !== '' || region !== 'all';
  });

  search(): void {
    this.criteria.update((criteria) => ({
      ...criteria,
      name: this.nameInput().trim(),
      location: this.locationInput().trim(),
      region: this.regionInput(),
      page: 1,
    }));
  }

  reset(): void {
    this.nameInput.set('');
    this.locationInput.set('');
    this.regionInput.set('all');
    this.criteria.update((criteria) => ({ ...DEFAULT_AGENCE_SEARCH, sort: criteria.sort }));
  }

  changeSort(event: Event): void {
    const sort = (event.target as HTMLSelectElement).value as AgenceSort;
    this.criteria.update((criteria) => ({ ...criteria, sort, page: 1 }));
  }

  goToPage(page: number): void {
    this.criteria.update((criteria) => ({ ...criteria, page }));
    // `scrollIntoView` n'existe pas dans l'environnement de test (jsdom).
    this.resultsTop()?.nativeElement.scrollIntoView?.({ behavior: 'smooth', block: 'start' });
  }
}
