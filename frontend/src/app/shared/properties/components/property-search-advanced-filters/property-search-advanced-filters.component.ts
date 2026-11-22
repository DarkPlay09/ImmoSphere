import { ChangeDetectionStrategy, Component, effect, input, output } from '@angular/core';

import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

import { PropertySearchOptionsResponse } from '../../models/property-search-options.model';

export interface PropertySearchAdvancedFilters {
  provinceId: number | null;
  etatId: number | null;

  garage: boolean;
  jardin: boolean;
  terrasse: boolean;
}

@Component({
  selector: 'app-property-search-advanced-filters',
  standalone: true,

  imports: [ReactiveFormsModule],

  templateUrl: './property-search-advanced-filters.component.html',
  styleUrl: './property-search-advanced-filters.component.scss',

  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PropertySearchAdvancedFiltersComponent {
  readonly options = input.required<PropertySearchOptionsResponse>();

  readonly initialProvinceId = input<number | null>(null);
  readonly initialEtatId = input<number | null>(null);

  readonly initialGarage = input(false);
  readonly initialJardin = input(false);
  readonly initialTerrasse = input(false);

  readonly filtersApplied = output<PropertySearchAdvancedFilters>();

  readonly form = new FormGroup({
    provinceId: new FormControl('', {
      nonNullable: true,
    }),

    etatId: new FormControl('', {
      nonNullable: true,
    }),

    garage: new FormControl(false, {
      nonNullable: true,
    }),

    jardin: new FormControl(false, {
      nonNullable: true,
    }),

    terrasse: new FormControl(false, {
      nonNullable: true,
    }),
  });

  constructor() {
    // Synchronise les champs avec les filtres présents dans l'URL.
    effect(() => {
      this.form.patchValue(
        {
          provinceId: this.initialProvinceId()?.toString() ?? '',
          etatId: this.initialEtatId()?.toString() ?? '',

          garage: this.initialGarage(),
          jardin: this.initialJardin(),
          terrasse: this.initialTerrasse(),
        },
        {
          emitEvent: false,
        },
      );
    });
  }

  private parseId(value: string): number | null {
    if (!value) {
      return null;
    }

    const id = Number(value);

    if (!Number.isInteger(id) || id <= 0) {
      return null;
    }

    return id;
  }

  /**
   * Transmet les filtres sélectionnés au parent.
   */
  applyFilters(): void {
    const values = this.form.getRawValue();

    this.filtersApplied.emit({
      provinceId: this.parseId(values.provinceId),
      etatId: this.parseId(values.etatId),

      garage: values.garage,
      jardin: values.jardin,
      terrasse: values.terrasse,
    });
  }

  /**
   * Réinitialise uniquement les filtres de ce panneau.
   */
  resetFilters(): void {
    this.form.reset({
      provinceId: '',
      etatId: '',

      garage: false,
      jardin: false,
      terrasse: false,
    });

    this.filtersApplied.emit({
      provinceId: null,
      etatId: null,

      garage: false,
      jardin: false,
      terrasse: false,
    });
  }
}
