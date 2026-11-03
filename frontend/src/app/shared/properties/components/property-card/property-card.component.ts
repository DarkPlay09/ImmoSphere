import { ChangeDetectionStrategy, Component, input, signal } from '@angular/core';

import { Property } from '../../models/property.model';

@Component({
  selector: 'app-property-card',
  standalone: true,
  templateUrl: './property-card.component.html',
  styleUrl: './property-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PropertyCardComponent {
  readonly property = input.required<Property>();

  readonly isFavorite = signal(false);

  toggleFavorite(): void {
    this.isFavorite.update((value) => !value);
  }
}
