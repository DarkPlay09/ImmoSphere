import { Component, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
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
  readonly isLoggedIn = input(false);
  readonly loginRequested = output<void>();
  readonly publishRequested = output<void>();
  readonly favoritesCount = input(0);
  readonly navigationLinks = NAVBAR_LINKS;
}
