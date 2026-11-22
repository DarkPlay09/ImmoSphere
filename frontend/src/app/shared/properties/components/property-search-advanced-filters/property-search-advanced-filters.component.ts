import { ChangeDetectionStrategy, Component, effect, input, output } from '@angular/core';

import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

import { PropertySearchOptionsResponse } from '../../models/property-search-options.model';

/**
 * Critères sélectionnés dans le panneau avancé.
 */
export interface PropertySearchAdvancedFilters {
  provinceId: number | null;
  etatId: number | null;
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

  readonly filtersApplied = output<PropertySearchAdvancedFilters>();

  readonly form = new FormGroup({
    provinceId: new FormControl('', {
      nonNullable: true,
    }),

    etatId: new FormControl('', {
      nonNullable: true,
    }),
  });

  constructor() {
    // Synchronise les champs si les filtres de l'URL changent.
    effect(() => {
      this.form.patchValue(
        {
          provinceId: this.initialProvinceId()?.toString() ?? '',
          etatId: this.initialEtatId()?.toString() ?? '',
        },
        {
          emitEvent: false,
        },
      );
    });
  }

  /**
   * Convertit la valeur d'un select en identifiant.
   */
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
   * Applique les filtres sélectionnés.
   */
  applyFilters(): void {
    const values = this.form.getRawValue();

    this.filtersApplied.emit({
      provinceId: this.parseId(values.provinceId),
      etatId: this.parseId(values.etatId),
    });
  }

  /**
   * Supprime les filtres de ce panneau.
   */
  resetFilters(): void {
    this.form.reset({
      provinceId: '',
      etatId: '',
    });

    this.filtersApplied.emit({
      provinceId: null,
      etatId: null,
    });
  }
}
