import { Routes } from '@angular/router';
import { MainLayoutComponent } from './layout/MainLayout/main-layout.component';

export const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'home',
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
      {
        path: 'home',
        loadComponent: () =>
          import('./features/pages/home/home.component').then(
            (m) => m.HomeComponent,
          )
      }
    ],
  },
];
