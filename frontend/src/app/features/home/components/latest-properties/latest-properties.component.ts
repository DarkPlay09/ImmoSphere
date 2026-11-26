import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';

import { toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';

import { catchError, of, tap } from 'rxjs';

import { PropertyCardComponent } from '../../../../shared/properties/components/property-card/property-card.component';

import { HomePropertiesApiService } from '../../data-access/home-properties-api.service';
import { HomeProperty } from '../../data-access/home-property.model';

type LatestFilter = 'all' | 'sale' | 'rent' | 'new' | '360';

@Component({
  selector: 'app-latest-properties',
  standalone: true,
  imports: [RouterLink, TranslatePipe, PropertyCardComponent],
  templateUrl: './latest-properties.component.html',
  styleUrl: './latest-properties.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LatestPropertiesComponent {
  private readonly api = inject(HomePropertiesApiService);

  readonly loading = signal(true);
  readonly error = signal(false);

  /**
   * Les annonces sont maintenant chargées depuis
   * le backend .NET et non depuis un fichier mock.
   */
  readonly properties = toSignal(
    this.api.getProperties().pipe(
      tap(() => {
        this.loading.set(false);
      }),

      catchError((error) => {
        console.error('Erreur lors du chargement des biens :', error);

        this.error.set(true);
        this.loading.set(false);

        return of([] as HomeProperty[]);
      }),
    ),
    {
      initialValue: [] as HomeProperty[],
    },
  );

  readonly activeFilter = signal<LatestFilter>('all');

  readonly filters: {
    value: LatestFilter;
    label: string;
  }[] = [
    { value: 'all', label: 'home.latest.all' },
    { value: 'sale', label: 'home.latest.sale' },
    { value: 'rent', label: 'home.latest.rent' },
    { value: 'new', label: 'home.latest.new' },
    { value: '360', label: 'home.latest.virtualTour' },
  ];

  readonly filteredProperties = computed(() => {
    const properties = this.properties();

    switch (this.activeFilter()) {
      case 'sale':
        return properties.filter((property) => property.transactionType === 'sale');

      case 'rent':
        return properties.filter((property) => property.transactionType === 'rent');

      case 'new':
        return properties.filter((property) => property.isNew);

      case '360':
        return properties.filter((property) => property.isVisit360);

      default:
        return properties;
    }
  });

  selectFilter(filter: LatestFilter): void {
    this.activeFilter.set(filter);
  }
}
