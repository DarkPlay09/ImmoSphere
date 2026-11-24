import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';

import { PropertySearchOptionsResponse } from '../../models/property-search-options.model';

type FilterKey =
  | 'transactionType'
  | 'location'
  | 'propertyType'
  | 'budgetMax'
  | 'bedrooms'
  | 'minArea'
  | 'peb'
  | 'provinceId'
  | 'etatId'
  | 'garage'
  | 'jardin'
  | 'terrasse'
  | 'parking'
  | 'balcon'
  | 'ascenseur'
  | 'piscine';

interface SearchFilterChip {
  key: FilterKey;
  label: string;
}

@Component({
  selector: 'app-property-search-active-filters',
  standalone: true,

  templateUrl: './property-search-active-filters.component.html',
  styleUrl: './property-search-active-filters.component.scss',

  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PropertySearchActiveFiltersComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  readonly options = input<PropertySearchOptionsResponse | null>(null);

  private readonly queryParams = toSignal(this.route.queryParamMap, {
    initialValue: this.route.snapshot.queryParamMap,
  });

  private readNumber(value: string | null): number | null {
    if (value === null || value.trim() === '') {
      return null;
    }

    const number = Number(value);

    if (!Number.isFinite(number) || number < 0) {
      return null;
    }

    return number;
  }

  private readId(value: string | null): number | null {
    const id = this.readNumber(value);

    if (id === null || !Number.isInteger(id) || id <= 0) {
      return null;
    }

    return id;
  }

  readonly chips = computed<SearchFilterChip[]>(() => {
    const params = this.queryParams();

    const chips: SearchFilterChip[] = [];



    const transaction = params.get('transactionType');

    if (transaction === 'sale') {
      chips.push({
        key: 'transactionType',
        label: 'À vendre',
      });
    } else if (transaction === 'rent') {
      chips.push({
        key: 'transactionType',
        label: 'À louer',
      });
    }



    const location = params.get('location')?.trim();

    if (location) {
      chips.push({
        key: 'location',
        label: `Localité : ${location}`,
      });
    }



    const propertyType = params.get('propertyType');

    const propertyLabels: Record<string, string> = {
      house: 'Maison',
      apartment: 'Appartement',
      land: 'Terrain',
    };

    if (propertyType && propertyType !== 'all') {
      chips.push({
        key: 'propertyType',
        label: propertyLabels[propertyType] ?? propertyType,
      });
    }



    const budgetMax = this.readNumber(params.get('budgetMax'));

    if (budgetMax !== null) {
      chips.push({
        key: 'budgetMax',
        label: `Max. ${budgetMax.toLocaleString('fr-BE')} €`,
      });
    }



    const bedrooms = this.readNumber(params.get('bedrooms'));

    if (bedrooms !== null && Number.isInteger(bedrooms)) {
      chips.push({
        key: 'bedrooms',
        label: `${bedrooms}+ chambres`,
      });
    }



    const minArea = this.readNumber(params.get('minArea'));

    if (minArea !== null) {
      chips.push({
        key: 'minArea',
        label: `Surface min. ${minArea} m²`,
      });
    }



    const peb = params.get('peb');

    if (peb && peb !== 'any') {
      chips.push({
        key: 'peb',
        label: `PEB ${peb}`,
      });
    }



    const provinceId = this.readId(params.get('provinceId'));

    if (provinceId !== null) {
      const province = this.options()?.provinces.find((option) => option.id === provinceId);

      chips.push({
        key: 'provinceId',
        label: `Province : ${province?.libelle ?? provinceId}`,
      });
    }



    const etatId = this.readId(params.get('etatId'));

    if (etatId !== null) {
      const etat = this.options()?.etats.find((option) => option.id === etatId);

      chips.push({
        key: 'etatId',
        label: `État : ${etat?.libelle ?? etatId}`,
      });

    }

    const equipment: { key: FilterKey; label: string }[] = [
      { key: 'garage', label: 'Garage' },
      { key: 'parking', label: 'Parking' },
      { key: 'jardin', label: 'Jardin' },
      { key: 'terrasse', label: 'Terrasse' },
      { key: 'balcon', label: 'Balcon' },
      { key: 'ascenseur', label: 'Ascenseur' },
      { key: 'piscine', label: 'Piscine' },
    ];

    for (const filter of equipment) {
      if (params.get(filter.key) === 'true') {
        chips.push(filter);
      }
    }

    return chips;
  });

  removeFilter(key: FilterKey): void {
    void this.router.navigate([], {
      relativeTo: this.route,

      queryParams: {
        [key]: null,
        page: null,
      },

      queryParamsHandling: 'merge',
    });
  }
}
