import { Routes } from '@angular/router';
import { MainLayoutComponent } from './layout/MainLayout/main-layout.component';

export const routes: Routes = [
  {
    path: 'inscription',
    redirectTo: 'register',
    pathMatch: 'full',
  },
  {
    path: 'verify-email',
    redirectTo: 'inscription/verification-email',
    pathMatch: 'full',
  },
  {
    path: 'inscription/verification-email',
    loadComponent: () =>
      import('./features/auth/pages/verify-email/verify-email.component').then(
        (m) => m.VerifyEmailComponent,
      ),
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./features/auth/pages/register/register.component').then(
        (m) => m.RegisterComponent,
      ),
  },
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      {
        path: 'properties',
        loadComponent: () =>
          import('./features/pages/properties-list/properties-list.component').then(
            (m) => m.PropertiesListComponent,
          ),
      },
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'properties',
      },
    ],
  },
];
