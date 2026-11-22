import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  OnInit,
  inject,
  signal,
} from '@angular/core';

import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { PropertySearchCardComponent } from '../../../shared/properties/components/property-search-card/property-search-card';

import { PropertySearchService } from '../../../shared/properties/data-access/property-search.service';

import { mapPropertySearchResult } from '../../../shared/properties/mappers/property-search.mapper';

import { PropertySearchResult } from '../../../shared/properties/models/property-search-result.model';

@Component({
  selector: 'app-properties-search',
  standalone: true,

  imports: [PropertySearchCardComponent],

  templateUrl: './properties-search.html',
  styleUrl: './properties-search.scss',

  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PropertiesSearchComponent implements OnInit {
  private readonly searchService = inject(PropertySearchService);
  private readonly destroyRef = inject(DestroyRef);

  readonly results = signal<PropertySearchResult[]>([]);

  readonly total = signal(0);

  readonly loading = signal(false);

  readonly error = signal<string | null>(null);

  readonly selectedPropertyId = signal<number | null>(null);

  ngOnInit(): void {
    this.loadResults();
  }

  loadResults(): void {
    this.loading.set(true);
    this.error.set(null);

    this.searchService
      .search({
        page: 1,
        taillePage: 12,
      })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          const properties = response.biens.map(mapPropertySearchResult);

          this.results.set(properties);

          this.total.set(response.total);

          this.selectedPropertyId.set(null);

          this.loading.set(false);
        },

        error: (error) => {
          console.error('Erreur lors du chargement des biens :', error);

          this.results.set([]);

          this.total.set(0);

          this.error.set('Impossible de charger les biens immobiliers. Veuillez réessayer.');

          this.loading.set(false);
        },
      });
  }

  onDetailsRequested(propertyId: number): void {
    this.selectedPropertyId.set(propertyId);

    // TODO: Brancher le lien vers le détails d'un bien.
    console.log('Détails du bien :', propertyId);
  }
}
