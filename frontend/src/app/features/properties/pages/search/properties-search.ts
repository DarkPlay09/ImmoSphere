import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  OnInit,
  computed,
  inject,
  signal,
  ViewChild,
} from '@angular/core';

import { ActivatedRoute, Params, Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Subscription, switchMap } from 'rxjs';

import { PropertySearchCardComponent } from '../../../../shared/properties/components/property-search-card/property-search-card';
import { PebBadgeComponent } from '../../../../shared/properties/components/peb-badge/peb-badge.component';

import {
  PropertySearchAdvancedFiltersComponent,
} from '../../../../shared/properties/components/property-search-advanced-filters/property-search-advanced-filters.component';

import { PropertySearchResultsToolbarComponent } from '../../../../shared/properties/components/property-search-results-toolbar/property-search-results-toolbar.component';

import { PropertySearchActiveFiltersComponent } from '../../../../shared/properties/components/property-search-active-filters/property-search-active-filters.component';

import { PropertyMapComponent } from '../../../../shared/properties/components/property-map/property-map.component';

import { PropertySearchService } from '../../../../shared/properties/data-access/property-search.service';

import { PropertySearchOptionsService } from '../../../../shared/properties/data-access/property-search-options.service';

import { mapPropertySearchResult } from '../../../../shared/properties/mappers/property-search.mapper';

import { PropertySearchResult } from '../../../../shared/properties/models/property-search-result.model';

import { MOCK_PROPERTIES } from '../../../../shared/properties/data/properties.mock';

import { PropertySearchQuery } from '../../../../shared/properties/models/property-search-api.model';

import {
  PropertySearchOption,
  PropertySearchOptionsResponse,
} from '../../../../shared/properties/models/property-search-options.model';

import {
  PropertyMapItem,
  PropertyMapKind,
} from '../../../../shared/notaries/models/property-map-tiem.model';

import { getMapCityCenter, normalizeCity } from '../../../home/data-access/map-city-centers';

type SearchSort = NonNullable<PropertySearchQuery['tri']>;

@Component({
  selector: 'app-properties-search',
  standalone: true,
  imports: [
    PropertySearchCardComponent,
    PebBadgeComponent,
    PropertySearchAdvancedFiltersComponent,
    PropertySearchResultsToolbarComponent,
    PropertySearchActiveFiltersComponent,
    PropertyMapComponent,
  ],
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

  @ViewChild(PropertySearchAdvancedFiltersComponent)
  private advancedFilters?: PropertySearchAdvancedFiltersComponent;

  private currentRequest?: Subscription;
  readonly filtersOpen = signal(false);

  private readonly pageSize = 12;

  readonly results = signal<PropertySearchResult[]>([]);
  readonly total = signal(0);

  readonly selectedSort = signal<SearchSort>('id-desc');
  readonly currentPage = signal(1);
  readonly totalPages = signal(0);

  readonly firstResultIndex = computed(() =>
    this.total() === 0 ? 0 : (this.currentPage() - 1) * this.pageSize + 1,
  );

  readonly lastResultIndex = computed(() =>
    Math.min(this.currentPage() * this.pageSize, this.total()),
  );

  readonly visiblePages = computed(() => {
    const total = this.totalPages();
    const current = this.currentPage();

    if (total <= 0) return [];

    const start = Math.max(1, Math.min(current - 2, total - 4));
    const end = Math.min(total, start + 4);

    return Array.from({ length: end - start + 1 }, (_, index) => start + index);
  });

  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  readonly selectedPropertyId = signal<number | null>(null);

  readonly appliedTransaction = signal<string | null>(null);
  readonly appliedLocation = signal('');

  readonly searchTitle = computed(() => {
    switch (this.appliedTransaction()) {
      case 'sale':
        return 'Biens immobiliers à vendre';
      case 'rent':
        return 'Biens immobiliers à louer';
      default:
        return 'Recherche immobilière';
    }
  });

  readonly viewMode = signal<'list' | 'grid'>('list');

  readonly filterOptions = signal<PropertySearchOptionsResponse | null>(null);

  readonly selectedProvinceId = signal<number | null>(null);
  readonly selectedEtatId = signal<number | null>(null);

  readonly selectedGarage = signal(false);
  readonly selectedJardin = signal(false);
  readonly selectedTerrasse = signal(false);
  readonly selectedParking = signal(false);
  readonly selectedBalcon = signal(false);
  readonly selectedAscenseur = signal(false);
  readonly selectedPiscine = signal(false);

  readonly advancedFilterCount = computed(() => [
    this.selectedProvinceId() !== null,
    this.selectedEtatId() !== null,
    this.selectedGarage(),
    this.selectedParking(),
    this.selectedJardin(),
    this.selectedTerrasse(),
    this.selectedBalcon(),
    this.selectedAscenseur(),
    this.selectedPiscine(),
  ].filter(Boolean).length);

  readonly mapProperties = computed<readonly PropertyMapItem[]>(() => {
    const occurrences = new Map<string, number>();

    return this.results().flatMap((property): PropertyMapItem[] => {
      const location = getMapCityCenter(property.city);

      if (!location) {
        return [];
      }

      const cityKey = normalizeCity(property.city);
      const occurrence = occurrences.get(cityKey) ?? 0;

      occurrences.set(cityKey, occurrence + 1);

      const angle = occurrence * 2.39996;

      const radius = occurrence === 0 ? 0 : 0.006 * Math.sqrt(occurrence);

      const title = property.title.toLowerCase();

      let kind: PropertyMapKind = 'apartment';

      if (title.includes('penthouse')) {
        kind = 'penthouse';
      } else if (title.includes('villa')) {
        kind = 'villa';
      } else if (title.includes('maison')) {
        kind = 'house';
      }

      return [
        {
          id: property.id,
          price: property.price,
          city: property.city,
          postalCode: property.postalCode,
          region: location.region,
          latitude: location.latitude + Math.sin(angle) * radius,
          longitude: location.longitude + Math.cos(angle) * radius,
          kind,
          imageUrl: property.imageUrl,
          peb: property.peb,
        },
      ];
    });
  });

  readonly selectedMapProperty = computed<PropertySearchResult | null>(() => {
    const selectedId = this.selectedPropertyId();

    if (selectedId === null) {
      return null;
    }

    const hasMarker = this.mapProperties().some((property) => property.id === selectedId);

    if (!hasMarker) {
      return null;
    }

    return this.results().find((property) => property.id === selectedId) ?? null;
  });

  ngOnInit(): void {
    this.route.queryParamMap.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((params) => {
      this.currentPage.set(this.readPage(params.get('page')));
      this.appliedTransaction.set(params.get('transactionType'));
      this.appliedLocation.set(params.get('location')?.trim() ?? '');

      const sort = params.get('tri');

      this.selectedSort.set(this.isSort(sort) ? sort : 'id-desc');

      this.selectedProvinceId.set(this.readId(params.get('provinceId')));

      this.selectedEtatId.set(this.readId(params.get('etatId')));

      this.selectedGarage.set(params.get('garage') === 'true');

      this.selectedJardin.set(params.get('jardin') === 'true');

      this.selectedTerrasse.set(params.get('terrasse') === 'true');

      this.selectedParking.set(params.get('parking') === 'true');

      this.selectedBalcon.set(params.get('balcon') === 'true');

      this.selectedAscenseur.set(params.get('ascenseur') === 'true');

      this.selectedPiscine.set(params.get('piscine') === 'true');

      this.loadResults();
    });
  }

  private readNumber(value: string | null): number | undefined {
    if (value === null || value.trim() === '') {
      return undefined;
    }

    const parsed = Number(value);

    return Number.isFinite(parsed) && parsed >= 0 ? parsed : undefined;
  }

  private readId(value: string | null): number | null {
    const id = this.readNumber(value);

    if (id === undefined || !Number.isInteger(id) || id <= 0) {
      return null;
    }

    return id;
  }

  private normalizeLabel(value: string): string {
    return value
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .trim()
      .toLowerCase();
  }

  private findOptionId(options: PropertySearchOption[], label: string): number {
    const normalizedLabel = this.normalizeLabel(label);

    const option = options.find((item) => this.normalizeLabel(item.libelle) === normalizedLabel);

    if (!option) {
      throw new Error(`Option de recherche introuvable : ${label}`);
    }

    return option.id;
  }

  private readPage(value: string | null): number {
    const page = this.readNumber(value);

    return page !== undefined && Number.isSafeInteger(page) && page >= 1 ? page : 1;
  }

  private isSort(value: string | null): value is SearchSort {
    return (
      value === 'id-desc' ||
      value === 'prix-asc' ||
      value === 'prix-desc' ||
      value === 'surface-desc'
    );
  }

  private buildSearchQuery(options: PropertySearchOptionsResponse): PropertySearchQuery {
    const params = this.route.snapshot.queryParamMap;

    const query: PropertySearchQuery = {
      page: this.readPage(params.get('page')),
      taillePage: this.pageSize,
      tri: this.selectedSort(),
    };

    const location = params.get('location')?.trim() ?? '';

    if (location) {
      if (/^\d{4}$/.test(location)) {
        query.codePostal = location;
      } else {
        query.localite = location;
      }
    }

    const budgetMax = this.readNumber(params.get('budgetMax'));

    if (budgetMax !== undefined) {
      query.prixMax = budgetMax;
    }

    const bedrooms = this.readNumber(params.get('bedrooms'));

    if (bedrooms !== undefined && Number.isInteger(bedrooms)) {
      query.nbChambresMin = bedrooms;
    }

    const minArea = this.readNumber(params.get('minArea'));

    if (minArea !== undefined) {
      query.surfaceMin = minArea;
    }

    const transactionType = params.get('transactionType');

    if (transactionType === 'sale') {
      query.typeTransactionId = this.findOptionId(options.typesTransactions, 'Vente');
    } else if (transactionType === 'rent') {
      query.typeTransactionId = this.findOptionId(options.typesTransactions, 'Location');
    } else if (transactionType) {
      throw new Error(`Type de transaction non pris en charge : ${transactionType}`);
    }

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

    const peb = params.get('peb');

    if (peb && peb !== 'any') {
      query.pebBienId = this.findOptionId(options.pebs, peb);
    }

    const provinceId = this.readId(params.get('provinceId'));

    if (provinceId !== null) {
      query.provinceId = provinceId;
    }

    const etatId = this.readId(params.get('etatId'));

    if (etatId !== null) {
      query.etatId = etatId;
    }

    if (params.get('garage') === 'true') {
      query.garage = true;
    }

    if (params.get('jardin') === 'true') {
      query.jardin = true;
    }

    if (params.get('terrasse') === 'true') {
      query.terrasse = true;
    }

    if (params.get('parking') === 'true') {
      query.parking = true;
    }

    if (params.get('balcon') === 'true') {
      query.balcon = true;
    }

    if (params.get('ascenseur') === 'true') {
      query.ascenseur = true;
    }

    if (params.get('piscine') === 'true') {
      query.piscine = true;
    }

    return query;
  }

  loadResults(): void {
    this.currentRequest?.unsubscribe();

    this.loading.set(true);
    this.error.set(null);

    this.currentRequest = this.optionsService
      .getOptions()
      .pipe(
        switchMap((options) => {
          this.filterOptions.set(options);

          return this.searchService.search(this.buildSearchQuery(options));
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: (response) => {
          this.results.set(response.biens.map(mapPropertySearchResult));

          this.total.set(response.total);

          this.currentPage.set(response.page);
          this.totalPages.set(response.nombrePages);

          this.selectedPropertyId.set(this.mapProperties()[0]?.id ?? null);

          this.loading.set(false);
        },

        error: (error) => {
          console.error('Erreur lors de la recherche des biens :', error);

          this.results.set([]);
          this.total.set(0);
          this.totalPages.set(0);
          this.selectedPropertyId.set(null);
          this.error.set('Impossible de charger les biens immobiliers. Veuillez réessayer.');

          this.loading.set(false);
        },
      });
  }

  onSearchRequested(params: Params): void {
    const filters = this.advancedFilters?.getFilters();
    const advancedParams: Params = filters ? {
      provinceId: filters.provinceId,
      etatId: filters.etatId,
      garage: filters.garage ? 'true' : null,
      parking: filters.parking ? 'true' : null,
      jardin: filters.jardin ? 'true' : null,
      terrasse: filters.terrasse ? 'true' : null,
      balcon: filters.balcon ? 'true' : null,
      ascenseur: filters.ascenseur ? 'true' : null,
      piscine: filters.piscine ? 'true' : null,
    } : {};

    void this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { ...params, ...advancedParams, page: null },
      queryParamsHandling: 'merge',
    });
  }

  toggleFilters(): void {
    this.filtersOpen.update((value) => !value);
  }

  clearSearch(toolbar: PropertySearchResultsToolbarComponent): void {
    toolbar.resetDraft();
    this.advancedFilters?.resetDraft();

    void this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { tri: this.route.snapshot.queryParamMap.get('tri') },
      queryParamsHandling: 'replace',
    });
  }

  onDetailsRequested(propertyId: number): void {
    void this.router.navigate(['/properties', propertyId]);
  }

  selectPropertyFromMap(propertyId: number): void {
    this.selectedPropertyId.set(propertyId);
  }

  onSortChange(value: string): void {
    if (!this.isSort(value)) return;

    void this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        tri: value === 'id-desc' ? null : value,
        page: null,
      },
      queryParamsHandling: 'merge',
    });
  }

  goToPage(page: number): void {
    if (
      !Number.isSafeInteger(page) ||
      page < 1 ||
      page > this.totalPages() ||
      page === this.currentPage()
    )
      return;

    void this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        page: page === 1 ? null : page,
      },
      queryParamsHandling: 'merge',
    });
  }

  setViewMode(mode: 'list' | 'grid'): void {
    this.viewMode.set(mode);
  }
}
