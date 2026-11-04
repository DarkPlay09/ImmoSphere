import { Component } from '@angular/core';

import { PropertyCardComponent } from '../../../shared/properties/components/property-card/property-card.component';

import { MOCK_PROPERTIES } from '../../../shared/properties/data/properties.mock';

@Component({
  selector: 'app-properties-list',
  standalone: true,
  imports: [PropertyCardComponent],
  templateUrl: './properties-list.component.html',
  styleUrl: './properties-list.component.scss',
})
export class PropertiesListComponent {
  readonly properties = MOCK_PROPERTIES;
}
