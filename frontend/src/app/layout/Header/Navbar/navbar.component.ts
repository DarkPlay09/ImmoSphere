import { Component, inject, input, output, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Component, input, output } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { finalize } from 'rxjs';

import { LanguagePickerComponent } from '../../LanguagePicker/language-picker.component';
import { AuthSessionService } from '../../../features/auth/data-access/auth-session.service';
import { NAVBAR_LINKS } from './data/navbar-links.data';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, TranslatePipe, LanguagePickerComponent],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})

export class NavbarComponent {
  private readonly router = inject(Router);

  readonly session = inject(AuthSessionService);

  readonly isLoggedIn = this.session.isAuthenticated;
  readonly isLoggingOut = signal(false);
  readonly logoutFailed = signal(false);

  readonly publishRequested = output<void>();
  readonly favoritesCount = input(0);
  readonly navigationLinks = NAVBAR_LINKS;

  goToLogin(): void {
    void this.router.navigate(['/register']);
  }

  logout(): void {
    if (this.isLoggingOut() || !this.isLoggedIn()) {
      return;
    }

    this.logoutFailed.set(false);
    this.isLoggingOut.set(true);

    this.session.logout()
      .pipe(
        finalize(() => {
          this.isLoggingOut.set(false);
        })
      )
      .subscribe({
        error: () => {
          this.logoutFailed.set(true);
        }
      });
  }
}
