import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import type { NavbarLink } from './models/navbar-links.model';

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
  readonly navigationLinks: NavbarLink[] = [
    {
      id: 'buy',
      label: 'Acheter',
      route: '/properties',
      queryParams: { transaction: 'sale' },
    },
    {
      id: 'rent',
      label: 'Louer',
      route: '/properties',
      queryParams: { transaction: 'rent' },
    },
    {
      id: 'agencies',
      label: 'Agences',
      route: null,
    },
    {
      id:'notaries',
      label:"Notaires",
      route: null,
    },
    {
      id: 'services',
      label: 'Services',
      route: null,
    },
  ];
}
