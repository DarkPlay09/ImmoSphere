import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  OnInit,
  inject,
  signal,
} from '@angular/core';

import { ActivatedRoute } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Subscription } from 'rxjs';

import { PropertySearchCardComponent } from '../../../shared/properties/components/property-search-card/property-search-card';

import { PropertySearchService } from '../../../shared/properties/data-access/property-search.service';

import { mapPropertySearchResult } from '../../../shared/properties/mappers/property-search.mapper';

import { PropertySearchResult } from '../../../shared/properties/models/property-search-result.model';

import { PropertySearchQuery } from '../../../shared/properties/models/property-search-api.model';

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
  private readonly route = inject(ActivatedRoute);

  private currentRequest?: Subscription;

  readonly results = signal<PropertySearchResult[]>([]);

  readonly total = signal(0);

  readonly loading = signal(false);

  readonly error = signal<string | null>(null);

  readonly selectedPropertyId = signal<number | null>(null);

  ngOnInit(): void {
    // Relance la recherche si les paramètres de l'URL changent.
    this.route.queryParamMap.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      this.loadResults();
    });
  }

  /**
   * Convertit un paramètre d'URL en nombre positif ou nul.
   * Retourne undefined si le paramètre est absent ou invalide.
   */
  private readNumber(value: string | null): number | undefined {
    if (value === null || value.trim() === '') {
      return undefined;
    }

    const parsed = Number(value);

    if (!Number.isFinite(parsed) || parsed < 0) {
      return undefined;
    }

    return parsed;
  }

  /**
   * Transforme les filtres transmis depuis l'accueil
   * en paramètres compatibles avec GET /api/biens.
   */
  private buildSearchQuery(): PropertySearchQuery {
    const params = this.route.snapshot.queryParamMap;

    const location = params.get('location')?.trim() ?? '';

    const budgetMax = this.readNumber(params.get('budgetMax'));

    const bedrooms = this.readNumber(params.get('bedrooms'));

    const minArea = this.readNumber(params.get('minArea'));

    const query: PropertySearchQuery = {
      page: 1,
      taillePage: 12,
    };

    if (location) {
      if (/^\d{4}$/.test(location)) {
        query.codePostal = location;
      } else {
        query.localite = location;
      }
    }

    if (budgetMax !== undefined) {
      query.prixMax = budgetMax;
    }

    if (bedrooms !== undefined && Number.isInteger(bedrooms)) {
      query.nbChambresMin = bedrooms;
    }

    if (minArea !== undefined) {
      query.surfaceMin = minArea;
    }

    return query;
  }

  /**
   * Charge les biens depuis PostgreSQL via l'API.
   */
  loadResults(): void {
    // Annule la requête précédente si une nouvelle recherche démarre.
    this.currentRequest?.unsubscribe();

    this.loading.set(true);
    this.error.set(null);

    const query = this.buildSearchQuery();

    this.currentRequest = this.searchService
      .search(query)
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
          console.error('Erreur lors de la recherche des biens :', error);

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
