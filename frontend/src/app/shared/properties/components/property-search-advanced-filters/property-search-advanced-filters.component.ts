import { ChangeDetectionStrategy, Component, effect, input, output } from '@angular/core';

import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

import { PropertySearchOptionsResponse } from '../../models/property-search-options.model';

export interface PropertySearchAdvancedFilters {
  provinceId: number | null;
  etatId: number | null;

  garage: boolean;
  jardin: boolean;
  terrasse: boolean;
  parking: boolean;
  balcon: boolean;
  ascenseur: boolean;
  piscine: boolean;
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

  // Valeurs initiales provenant de l'URL.
  readonly initialProvinceId = input<number | null>(null);
  readonly initialEtatId = input<number | null>(null);

  readonly initialGarage = input(false);
  readonly initialJardin = input(false);
  readonly initialTerrasse = input(false);
  readonly initialParking = input(false);
  readonly initialBalcon = input(false);
  readonly initialAscenseur = input(false);
  readonly initialPiscine = input(false);

  // Envoie les filtres au composant parent.
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

    parking: new FormControl(false, {
      nonNullable: true,
    }),

    balcon: new FormControl(false, {
      nonNullable: true,
    }),

    ascenseur: new FormControl(false, {
      nonNullable: true,
    }),

    piscine: new FormControl(false, {
      nonNullable: true,
    }),
  });

  constructor() {
    // Synchronise le formulaire avec les paramètres de l'URL.
    effect(() => {
      this.form.patchValue(
        {
          provinceId: this.initialProvinceId()?.toString() ?? '',
          etatId: this.initialEtatId()?.toString() ?? '',

          garage: this.initialGarage(),
          jardin: this.initialJardin(),
          terrasse: this.initialTerrasse(),
          parking: this.initialParking(),
          balcon: this.initialBalcon(),
          ascenseur: this.initialAscenseur(),
          piscine: this.initialPiscine(),
        },
        {
          emitEvent: false,
        },
      );
    });
  }

  /**
   * Convertit la valeur d'un select en identifiant valide.
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

      garage: values.garage,
      jardin: values.jardin,
      terrasse: values.terrasse,
      parking: values.parking,
      balcon: values.balcon,
      ascenseur: values.ascenseur,
      piscine: values.piscine,
    });
  }

  /**
   * Réinitialise uniquement les filtres avancés.
   */
  resetFilters(): void {
    this.form.reset({
      provinceId: '',
      etatId: '',

      garage: false,
      jardin: false,
      terrasse: false,
      parking: false,
      balcon: false,
      ascenseur: false,
      piscine: false,
    });

    this.filtersApplied.emit({
      provinceId: null,
      etatId: null,

      garage: false,
      jardin: false,
      terrasse: false,
      parking: false,
      balcon: false,
      ascenseur: false,
      piscine: false,
    });
  }
}
