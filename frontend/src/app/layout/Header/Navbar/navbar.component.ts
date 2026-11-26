import { Component, computed, inject, input, output, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { finalize } from 'rxjs';

import { LanguagePickerComponent } from '../../LanguagePicker/language-picker.component';
import { AuthSessionService } from '../../../features/auth/data-access/auth-session.service';
import { NAVBAR_LINKS } from './data/navbar-links.data';

import { PropertyFavoritesStore } from '../../../shared/properties/data-access/property-favorites.store';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, TranslatePipe, LanguagePickerComponent],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent {
  private readonly router = inject(Router);
  private readonly favoritesStore = inject(PropertyFavoritesStore);

  readonly session = inject(AuthSessionService);

  readonly isLoggedIn = this.session.isAuthenticated;
  readonly isLoggingOut = signal(false);
  readonly logoutFailed = signal(false);

  readonly publishRequested = output<void>();
  readonly navigationLinks = NAVBAR_LINKS;

  readonly favoritesCount = this.favoritesStore.count;
  readonly favoritesReady = this.favoritesStore.isReady;

  readonly favoritesLoading = computed(() => {
    const sessionStatus = this.session.status();
    const favoritesStatus = this.favoritesStore.status();

    return (
      sessionStatus === 'idle' ||
      sessionStatus === 'loading' ||
      (this.isLoggedIn() && (favoritesStatus === 'idle' || favoritesStatus === 'loading'))
    );
  });

  readonly favoritesDisabled = computed(
    () => this.favoritesLoading() || (this.isLoggedIn() && this.favoritesReady()),
  );

  readonly favoritesLabelKey = computed(() => {
    if (this.favoritesLoading()) {
      return 'favorites.loading';
    }

    if (this.session.status() === 'error') {
      return 'favorites.retrySession';
    }

    if (!this.isLoggedIn()) {
      return 'favorites.openLogin';
    }

    if (this.favoritesStore.status() === 'error') {
      return 'favorites.retryLoad';
    }

    return 'favorites.pagePending';
  });

  goToLogin(): void {
    void this.router.navigate(['/register']);
  }

  logout(): void {
    if (this.isLoggingOut() || !this.isLoggedIn()) {
      return;
    }

    this.logoutFailed.set(false);
    this.isLoggingOut.set(true);

    this.session
      .logout()
      .pipe(
        finalize(() => {
          this.isLoggingOut.set(false);
        }),
      )
      .subscribe({
        error: () => {
          this.logoutFailed.set(true);
        },
      });
  }

  onFavoritesRequested(): void {
    if (this.favoritesDisabled()) {
      return;
    }

    if (this.session.status() === 'error') {
      this.session.refresh();
      return;
    }

    if (!this.isLoggedIn()) {
      void this.router.navigate(['/login']);
      return;
    }

    if (this.favoritesStore.status() === 'error') {
      this.favoritesStore.retryLoad();
    }
  }
}
