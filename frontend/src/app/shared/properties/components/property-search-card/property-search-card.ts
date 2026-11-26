import { ChangeDetectionStrategy, Component, inject, input, output } from '@angular/core';
import { PropertySearchResult } from '../../models/property-search-result.model';
import { Router } from '@angular/router';
import { PropertyFavoriteButtonComponent } from '../property-favorite-button/property-favorite-button.component';
import { PebBadgeComponent } from '../peb-badge/peb-badge.component';

@Component({
  selector: 'app-property-search-card',
  standalone: true,
  imports: [PropertyFavoriteButtonComponent, PebBadgeComponent],
  templateUrl: './property-search-card.html',
  styleUrl: './property-search-card.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PropertySearchCardComponent {
  private readonly router = inject(Router);

  readonly property = input.required<PropertySearchResult>();

  readonly selected = input(false);

  readonly detailsRequested = output<number>();

  onLoginRequested(): void {
    void this.router.navigate(['/login']);
  }

  openDetails(): void {
    this.detailsRequested.emit(this.property().id);
  }
}
