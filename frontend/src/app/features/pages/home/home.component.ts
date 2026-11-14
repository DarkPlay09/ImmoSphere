import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';

import { HomeHeroComponent} from '../../home/components/home-hero/home-hero.component';
import { PropertySearchFormComponent } from '../../../shared/properties/components/property-search-form/property-search-form.component';
import { PropertySearchFilters } from '../../../shared/properties/models/property-search-filters.model';
import { LatestPropertiesComponent } from '../../home/components/latest-properties/latest-properties.component';
import { FeaturedNotariesComponent } from '../../home/components/featured-notaries/featured-notaries.component';
import { HomeMapSectionComponent } from '../../home/components/home-map-section/home-map-section.component';
import { PublishPropertyCtaComponent } from '../../home/components/publish-property-cta/publish-property-cta.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    HomeHeroComponent,
    PropertySearchFormComponent,
    LatestPropertiesComponent,
    FeaturedNotariesComponent,
    HomeMapSectionComponent,
    PublishPropertyCtaComponent
  ],
  templateUrl: './home.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent {
  private readonly router = inject(Router);

  onSearchRequested(filters: PropertySearchFilters): void {
    void this.router.navigate(['/search'], {
      queryParams: {
        transactionType: filters.transactionType,
        location: filters.location || null,
        propertyType: filters.propertyType === 'all'
          ? null
          : filters.propertyType,
        budgetMax: filters.budgetMax,
        bedrooms: filters.bedrooms,
        minArea: filters.minArea,
        peb: filters.peb
      },
    });
  }
}
