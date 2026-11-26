import { ChangeDetectionStrategy, Component, inject, input, signal } from '@angular/core';
import { Property } from '../../models/property.model';
import { Router } from '@angular/router';
import { PropertyFavoriteButtonComponent } from '../property-favorite-button/property-favorite-button.component';

@Component({
  selector: 'app-property-card',
  standalone: true,
  imports: [PropertyFavoriteButtonComponent],
  templateUrl: './property-card.component.html',
  styleUrl: './property-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PropertyCardComponent {
  readonly property = input.required<Property>();

  private readonly router = inject(Router);

  readonly favoritesEnabled = input(false);

  onLoginRequested(): void {
    void this.router.navigate(['/login']);
  }
}
