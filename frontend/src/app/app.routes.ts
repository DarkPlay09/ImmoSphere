import { Routes } from '@angular/router';
import { MainLayoutComponent } from './layout/MainLayout/main-layout.component';

export const routes: Routes = [
  {
    path: 'inscription/verification-email',
    loadComponent: () =>
      import('./features/auth/pages/verify-email/verify-email.component').then(
        (m) => m.VerifyEmailComponent,
      ),
  },
  // {
  //   path: 'login',
  //   loadComponent: () =>
  //     import('./features/auth/pages/register/register.component').then((m) => m.RegisterComponent),
  // },
  {
    path: 'register',
    loadComponent: () =>
      import('./features/auth/pages/register/register.component').then((m) => m.RegisterComponent),
  },
  {
    path: 'verify-email',
    loadComponent: () =>
      import('./features/auth/pages/verify-email/verify-email.component').then(m => m.VerifyEmailComponent),
  },
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'properties',
      },
    ],
  },
];
