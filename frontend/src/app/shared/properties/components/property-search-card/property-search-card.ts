import { ChangeDetectionStrategy, Component, input, model, output } from '@angular/core';

import { PropertySearchResult } from '../../models/property-search-result.model';

@Component({
  selector: 'app-property-search-card',
  standalone: true,
  templateUrl: './property-search-card.html',
  styleUrl: './property-search-card.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PropertySearchCardComponent {
  readonly property = input.required<PropertySearchResult>();

  readonly selected = input(false);

  readonly favorite = model(false);

  readonly detailsRequested = output<number>();

  toggleFavorite(): void {
    this.favorite.update((value) => !value);
  }

  openDetails(): void {
    this.detailsRequested.emit(this.property().id);
  }
}
