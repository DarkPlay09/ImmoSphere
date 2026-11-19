import { HttpErrorResponse } from '@angular/common/http';
import {
  computed,
  inject,
  Injectable,
  signal,
} from '@angular/core';

import { environment } from '../../../../../environments/environments';
import { AuthApiService } from './auth-api.service';

export interface AuthenticatedUser {
  id: string;
  email: string;
}

export type AuthSessionStatus =
  | 'idle'
  | 'loading'
  | 'authenticated'
  | 'anonymous'
  | 'error';

@Injectable({
  providedIn: 'root',
})
export class AuthSessionService {
  private readonly api = inject(AuthApiService);

  private readonly userState = signal<AuthenticatedUser | null>(null);

  private readonly statusState = signal<AuthSessionStatus>('idle');

  readonly user = this.userState.asReadonly();
  readonly status = this.statusState.asReadonly();

  readonly isAuthenticated = computed(
    () => this.status() === 'authenticated'
  );

  // Vérifie si l'utilisateur possède une session valide côté backend.
  refresh(): void {
    if (!environment.authSessionCookiesEnabled) {
      this.userState.set(null);
      this.statusState.set('anonymous');
      return;
    }

    // Evite les requêtes simultanées.
    if (this.status() === 'loading') {
      return;
    }

    this.statusState.set('loading');

    this.api.getCurrentUser().subscribe({
      next: (user) => {
        this.userState.set(user);
        this.statusState.set('authenticated');
      },

      error: (error: HttpErrorResponse) => {
        this.userState.set(null);

        if (error.status === 401) {
          this.statusState.set('anonymous');
        } else {
          this.statusState.set('error');
        }
      },
    });
  }

  /**
   * Réinitialise l'état local de la session.
   */
  clear(): void {
    this.userState.set(null);
    this.statusState.set('anonymous');
  }
}
