import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'properties',
    pathMatch: 'full',
  },
  {
    path: 'properties',
    loadComponent: () =>
      import('./features/pages/properties-list/properties-list.component').then(
        (m) => m.PropertiesListComponent,
      ),
  },
  {
    path: 'search',
    loadComponent: () =>
      import('./features/pages/properties-search/properties-search').then(
        (m) => m.PropertiesSearchComponent,
      ),
  },
];
