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
      import('./features/auth/pages/register/register.component').then((m) => m.RegisterComponent),
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/pages/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'forgot-password',
    loadComponent: () =>
      import('./features/auth/pages/forgot-password/forgot-password.component').then(
        (m) => m.ForgotPasswordComponent,
      ),
  },
  {
    path: 'forgot-password/confirmation',
    loadComponent: () =>
      import('./features/auth/pages/forgot-password-confirmation/forgot-password-confirmation.component').then(
        (m) => m.ForgotPasswordConfirmationComponent,
      ),
  },
  {
    path: 'reset-password',
    loadComponent: () =>
      import('./features/auth/pages/reset-password/reset-password.component').then(
        (m) => m.ResetPasswordComponent,
      ),
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/pages/login/login.component').then(
        (m) => m.LoginComponent,
      ),
  },
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./features/pages/home/home.component').then((m) => m.HomeComponent),
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
        path: 'agences',
        loadComponent: () =>
          import('./features/pages/agences-list/agences-list.component').then(
            (m) => m.AgencesListComponent,
          ),
      },
      {
        path: 'agences/:id',
        loadComponent: () =>
          import('./features/pages/agence-detail/agence-detail.component').then(
            (m) => m.AgenceDetailComponent,
          ),
      },
      {
        path: 'faq',
        loadComponent: () =>
          import('./features/pages/faq/faq.component').then(
            (m) => m.FaqComponent,
          ),
      },
    ],
  },
];
