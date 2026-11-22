import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  OnInit,
  inject,
  signal,
} from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Subscription, switchMap } from 'rxjs';

import { PropertySearchCardComponent } from '../../../shared/properties/components/property-search-card/property-search-card';

import { PropertySearchService } from '../../../shared/properties/data-access/property-search.service';

import { mapPropertySearchResult } from '../../../shared/properties/mappers/property-search.mapper';

import { PropertySearchResult } from '../../../shared/properties/models/property-search-result.model';

import { PropertySearchQuery } from '../../../shared/properties/models/property-search-api.model';
import { PropertySearchOptionsService } from '../../../shared/properties/data-access/property-search-options.service';
import {
  PropertySearchOption,
  PropertySearchOptionsResponse,
} from '../../../shared/properties/models/property-search-options.model';
import {
  PropertySearchAdvancedFilters,
  PropertySearchAdvancedFiltersComponent,
} from '../../../shared/properties/components/property-search-advanced-filters/property-search-advanced-filters.component';

@Component({
  selector: 'app-properties-search',
  standalone: true,

  imports: [PropertySearchCardComponent, PropertySearchAdvancedFiltersComponent],

  templateUrl: './properties-search.html',
  styleUrl: './properties-search.scss',

  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PropertiesSearchComponent implements OnInit {
  private readonly searchService = inject(PropertySearchService);
  private readonly optionsService = inject(PropertySearchOptionsService);

  private readonly destroyRef = inject(DestroyRef);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  private currentRequest?: Subscription;

  readonly results = signal<PropertySearchResult[]>([]);

  readonly total = signal(0);

  readonly loading = signal(false);

  readonly error = signal<string | null>(null);

  readonly selectedPropertyId = signal<number | null>(null);

  readonly filterOptions = signal<PropertySearchOptionsResponse | null>(null);

  readonly selectedProvinceId = signal<number | null>(null);
  readonly selectedEtatId = signal<number | null>(null);

  ngOnInit(): void {
    this.route.queryParamMap.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((params) => {
      this.selectedProvinceId.set(this.readId(params.get('provinceId')));

      this.selectedEtatId.set(this.readId(params.get('etatId')));

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
   * Lit un identifiant PostgreSQL valide.
   */
  private readId(value: string | null): number | null {
    const id = this.readNumber(value);

    if (id === undefined || !Number.isInteger(id) || id <= 0) {
      return null;
    }

    return id;
  }

  /**
   * Normalise un libellé pour faciliter les comparaisons.
   */
  private normalizeLabel(value: string): string {
    return value
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .trim()
      .toLowerCase();
  }

  /**
   * Retrouve l'identifiant PostgreSQL associé à un libellé.
   */
  private findOptionId(options: PropertySearchOption[], label: string): number {
    const normalizedLabel = this.normalizeLabel(label);

    const option = options.find((item) => this.normalizeLabel(item.libelle) === normalizedLabel);

    if (!option) {
      throw new Error(`Option de recherche introuvable : ${label}`);
    }

    return option.id;
  }

  /**
   * Transforme les paramètres de l'URL en critères compris par l'API.
   */
  private buildSearchQuery(options: PropertySearchOptionsResponse): PropertySearchQuery {
    const params = this.route.snapshot.queryParamMap;

    const query: PropertySearchQuery = {
      page: 1,
      taillePage: 12,
    };

    // ==========================================
    // LOCALITÉ
    // ==========================================

    const location = params.get('location')?.trim() ?? '';

    if (location) {
      if (/^\d{4}$/.test(location)) {
        query.codePostal = location;
      } else {
        query.localite = location;
      }
    }

    // ==========================================
    // BUDGET MAXIMUM
    // ==========================================

    const budgetMax = this.readNumber(params.get('budgetMax'));

    if (budgetMax !== undefined) {
      query.prixMax = budgetMax;
    }

    // ==========================================
    // NOMBRE MINIMUM DE CHAMBRES
    // ==========================================

    const bedrooms = this.readNumber(params.get('bedrooms'));

    if (bedrooms !== undefined && Number.isInteger(bedrooms)) {
      query.nbChambresMin = bedrooms;
    }

    // ==========================================
    // SURFACE MINIMALE
    // ==========================================

    const minArea = this.readNumber(params.get('minArea'));

    if (minArea !== undefined) {
      query.surfaceMin = minArea;
    }

    // ==========================================
    // TYPE DE TRANSACTION
    // ==========================================

    const transactionType = params.get('transactionType');

    if (transactionType === 'sale') {
      query.typeTransactionId = this.findOptionId(options.typesTransactions, 'Vente');
    } else if (transactionType === 'rent') {
      query.typeTransactionId = this.findOptionId(options.typesTransactions, 'Location');
    } else if (transactionType) {
      throw new Error(`Type de transaction non pris en charge : ${transactionType}`);
    }

    // ==========================================
    // TYPE DE BIEN
    // ==========================================

    const propertyType = params.get('propertyType');

    const propertyTypeLabels: Record<string, string> = {
      house: 'Maison',
      apartment: 'Appartement',
      land: 'Terrain',
    };

    if (propertyType && propertyType !== 'all') {
      const label = propertyTypeLabels[propertyType];

      if (!label) {
        throw new Error(`Type de bien non pris en charge : ${propertyType}`);
      }

      query.typeBienId = this.findOptionId(options.typesBiens, label);
    }

    // ==========================================
    // CLASSE ÉNERGÉTIQUE (PEB)
    // ==========================================

    const peb = params.get('peb');

    if (peb && peb !== 'any') {
      query.pebBienId = this.findOptionId(options.pebs, peb);
    }

    // ==========================================
    // PROVINCE
    // ==========================================

    const provinceId = this.readId(
      params.get('provinceId')
    );

    if (provinceId !== null) {
      query.provinceId = provinceId;
    }

    // ==========================================
    // ÉTAT DU BIEN
    // ==========================================

    const etatId = this.readId(
      params.get('etatId')
    );

    if (etatId !== null) {
      query.etatId = etatId;
    }

    return query;
  }

  /**
   * Charge les résultats depuis PostgreSQL.
   */
  loadResults(): void {
    // Annule la recherche précédente si nécessaire.
    this.currentRequest?.unsubscribe();

    this.loading.set(true);
    this.error.set(null);

    // On récupère d'abord les ID réels des filtres,
    // puis on effectue la recherche.
    this.currentRequest = this.optionsService
      .getOptions()
      .pipe(
        switchMap((options) => {
          this.filterOptions.set(options);

          const query = this.buildSearchQuery(options);

          return this.searchService.search(query);
        }),

        takeUntilDestroyed(this.destroyRef),
      )
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

  /**
   * Applique les filtres avancés.
   */
  onAdvancedFiltersApplied(filters: PropertySearchAdvancedFilters): void {
    void this.router.navigate([], {
      relativeTo: this.route,

      queryParams: {
        provinceId: filters.provinceId,
        etatId: filters.etatId,
      },

      queryParamsHandling: 'merge',
    });
  }

  onDetailsRequested(propertyId: number): void {
    this.selectedPropertyId.set(propertyId);

    // TODO: Brancher le lien vers le détails d'un bien.
    console.log('Détails du bien :', propertyId);
  }
}
