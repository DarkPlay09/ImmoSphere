import { Component, ElementRef, inject, input, model, output, signal } from '@angular/core';
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
  host: {
    '(document:click)': 'onDocumentClick($event)',
  },
})
export class NavbarComponent {
  private readonly element = inject(ElementRef<HTMLElement>);
  readonly isLanguageMenuOpen = signal(false);

  toggleLanguageMenu(): void {
    this.isLanguageMenuOpen.update((isOpen) => !isOpen);
  }

  closeLanguageMenu(): void {
    this.isLanguageMenuOpen.set(false);
  }

  onDocumentClick(event: MouseEvent): void {
    const selector = this.element.nativeElement.querySelector('.navbar__language');

    if (event.target instanceof Node && !selector?.contains(event.target)) {
      this.closeLanguageMenu();
    }
  }

  onLanguageFocusOut(event: FocusEvent): void {
    const selector = event.currentTarget as HTMLElement;

    if (!(event.relatedTarget instanceof Node) || !selector.contains(event.relatedTarget)) {
      this.closeLanguageMenu();
    }
  }

  readonly isLoggedIn = input(false);
  readonly loginRequested = output<void>();
  readonly publishRequested = output<void>();
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
      this.closeLanguageMenu();
    }
  }
}
