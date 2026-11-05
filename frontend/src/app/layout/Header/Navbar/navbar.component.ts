import { Component, input, model } from '@angular/core';
import { RouterLink } from '@angular/router';
import type { NavbarLink } from './models/navbar-links.model';
import type { LanguageCode, LanguageOption } from './models/language.model';
import { NAVBAR_LINKS } from './data/navbar-links.data';
import { LANGUAGES } from './data/languages.data';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent {
  readonly isLoggedIn = input(false);
  readonly favoritesCount = input(0);
  readonly navigationLinks: NavbarLink[] = NAVBAR_LINKS;
  readonly language = model<LanguageCode>('fr');
  readonly languages: LanguageOption[] = LANGUAGES;

  changeLanguage(code: string): void {
    const selectedLanguage = this.languages.find(
      l => l.code === code
    );

    if(selectedLanguage) {
      this.language.set(selectedLanguage.code);
    }
  }
}
