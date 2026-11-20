import { ChangeDetectionStrategy, Component, ViewChild, computed, signal } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

import { PropertyMapComponent } from '../../../../shared/properties/components/property-map/property-map.component';

import { MAP_PROPERTIES } from '../../data-access/map-properties.mock';
import { BelgiumRegion } from '../../../../shared/notaries/models/property-map-tiem.model';

type RegionFilter = BelgiumRegion | 'all';

@Component({
  selector: 'app-home-map-section',
  standalone: true,
  imports: [TranslatePipe, PropertyMapComponent],
  templateUrl: './home-map-section.component.html',
  styleUrl: './home-map-section.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeMapSectionComponent {
  @ViewChild(PropertyMapComponent)
  private propertyMap?: PropertyMapComponent;

  readonly properties = MAP_PROPERTIES;

  readonly regions: readonly {
    value: RegionFilter;
    labelKey: string;
  }[] = [
    { value: 'all', labelKey: 'home.map.allBelgium' },
    { value: 'brussels', labelKey: 'home.map.brussels' },
    { value: 'flanders', labelKey: 'home.map.flanders' },
    { value: 'wallonia', labelKey: 'home.map.wallonia' },
  ];

  readonly activeRegion = signal<RegionFilter>('all');
  readonly selectedPropertyId = signal<number | null>(101);

  readonly visibleProperties = computed(() => {
    const region = this.activeRegion();

    if (region === 'all') {
      return this.properties;
    }

    return this.properties.filter((property) => property.region === region);
  });

  readonly selectedProperty = computed(() => {
    const id = this.selectedPropertyId();

    return this.visibleProperties().find((property) => property.id === id) ?? null;
  });

  selectRegion(region: RegionFilter): void {
    this.activeRegion.set(region);

    const firstProperty = this.visibleProperties()[0];

    this.selectedPropertyId.set(firstProperty?.id ?? null);
  }

  selectProperty(propertyId: number): void {
    this.selectedPropertyId.set(propertyId);
  }

  focusMap(): void {
    this.propertyMap?.focus();
  }
}
