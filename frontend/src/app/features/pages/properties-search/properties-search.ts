import { Component } from '@angular/core';

import { PropertySearchCardComponent } from '../../../shared/properties/components/property-search-card/property-search-card';

import { PropertySearchResult } from '../../../shared/properties/models/property-search-result.model';

import { MOCK_PROPERTIES } from '../../../shared/properties/data/properties.mock';

@Component({
  selector: 'app-properties-search',
  standalone: true,
  imports: [PropertySearchCardComponent],
  templateUrl: './properties-search.html',
  styleUrl: './properties-search.scss',
})

export class PropertiesSearchComponent {
  readonly results: PropertySearchResult[] = [
    {
      ...MOCK_PROPERTIES[0]!,

      description: 'Superbe vue dégagée sur la Meuse, cuisine contemporaine hyper-équipée.',

      photoCount: 14,
      photoIndex: 1,

      extraFeatures: ['14 m² terr.', 'Étage 3/6'],

      financialNote: 'Estimation frais notariaux : ~35 600 €',

      advertiserName: 'Horizon Immo Liège (IPI 508.214)',
    },
  ];

  readonly selectedPropertyId = this.results[0]?.id ?? null;

  onDetailsRequested(propertyId: number): void {
    console.log('Détails du bien :', propertyId);
  }
}
