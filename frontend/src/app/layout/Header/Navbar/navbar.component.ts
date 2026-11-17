import { Component, inject, input, output } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';

import { LanguagePickerComponent } from '../../LanguagePicker/language-picker.component';
import { NAVBAR_LINKS } from './data/navbar-links.data';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, TranslatePipe, LanguagePickerComponent],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})

export class NavbarComponent {
  private readonly router = inject(Router);

  readonly isLoggedIn = input(false);
  readonly publishRequested = output<void>();
  readonly favoritesCount = input(0);
  readonly navigationLinks = NAVBAR_LINKS;

  goToLogin(): void {
    void this.router.navigate(['/register']);
  }
}
