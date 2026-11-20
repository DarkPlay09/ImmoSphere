import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';

import { PropertyCardComponent } from '../../../../shared/properties/components/property-card/property-card.component';
import { LATEST_PROPERTIES } from '../../data-access/latest-properties.mock';

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
  readonly properties = LATEST_PROPERTIES;

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
    switch (this.activeFilter()) {
      case 'sale':
        return this.properties.filter((property) => property.transactionType === 'sale');

      case 'rent':
        return this.properties.filter((property) => property.transactionType === 'rent');

      case 'new':
        return this.properties.filter((property) => property.isNew);

      case '360':
        return this.properties.filter((property) => property.isVisit360);

      default:
        return this.properties;
    }
  });

  selectFilter(filter: LatestFilter): void {
    this.activeFilter.set(filter);
  }
}
