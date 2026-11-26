import { ChangeDetectionStrategy, Component, computed, inject, input, output } from '@angular/core';

import { TranslatePipe } from '@ngx-translate/core';

import { AuthSessionService } from '../../../../features/auth/data-access/auth-session.service';
import { PropertyFavoritesStore } from '../../data-access/property-favorites.store';

@Component({
  selector: 'app-property-favorite-button',
  standalone: true,
  imports: [TranslatePipe],
  templateUrl: './property-favorite-button.component.html',
  styleUrl: './property-favorite-button.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PropertyFavoriteButtonComponent {
  private readonly store = inject(PropertyFavoritesStore);
  private readonly session = inject(AuthSessionService);

  readonly propertyId = input.required<number>();
  readonly size = input<'small' | 'regular' | 'large'>('regular');

  readonly loginRequested = output<void>();

  readonly isFavorite = computed(() => this.store.isFavorite(this.propertyId()));

  readonly isPending = computed(() => this.store.isPending(this.propertyId()));

  readonly hasFailed = computed(() => this.store.hasFailed(this.propertyId()));

  readonly isDisabled = computed(() => {
    const sessionStatus = this.session.status();

    return (
      sessionStatus === 'idle' ||
      sessionStatus === 'loading' ||
      this.isPending() ||
      (this.session.isAuthenticated() && (this.store.status() === 'idle' || this.store.isLoading()))
    );
  });

  readonly labelKey = computed(() => {
    if (this.isDisabled()) {
      return 'favorites.loading';
    }

    if (this.session.status() === 'error') {
      return 'favorites.retrySession';
    }

    if (!this.session.isAuthenticated()) {
      return 'favorites.loginRequired';
    }

    if (this.store.status() === 'error') {
      return 'favorites.retryLoad';
    }

    return this.isFavorite() ? 'favorites.remove' : 'favorites.add';
  });

  toggleFavorite(event: MouseEvent): void {
    event.stopPropagation();

    if (this.isDisabled()) {
      return;
    }

    if (this.session.status() === 'error') {
      this.session.refresh();
      return;
    }

    if (!this.session.isAuthenticated()) {
      this.loginRequested.emit();
      return;
    }

    if (this.store.status() === 'error') {
      this.store.retryLoad();
      return;
    }

    this.store.toggleFavorite(this.propertyId());
  }
}
