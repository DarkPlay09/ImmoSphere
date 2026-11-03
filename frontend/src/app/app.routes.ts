import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'properties',
    loadComponent: () =>
      import('./features/pages/properties-list/properties-list.component').then(
        (m) => m.PropertiesListComponent,
      ),
  },
];
