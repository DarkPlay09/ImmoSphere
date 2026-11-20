import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../environments/environments';

import type { RegistrationFormValue } from '../pages/register/register.component';

export interface VerifyEmailRequest {
  email: string;
  code: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthApiService {
  private readonly http = inject(HttpClient);

  // Création du compte
  postRegisterForm(data: RegistrationFormValue) {
    return this.http.post(`${environment.apiUrl}/api/auth/register`, data);
  }

  // Confirmation de l'adresse e-mail
  verifyEmail(data: VerifyEmailRequest) {
    return this.http.post<void>(`${environment.apiUrl}/api/auth/verify-email`, data, {
      withCredentials: environment.authSessionCookiesEnabled,
    });
  }

  // Récupération de l'utilisateur connecté
  getCurrentUser() {
    return this.http.get<{
      id: string;
      email: string;
    }>(`${environment.apiUrl}/api/auth/me`, {
      withCredentials: true,
    });
  }

  logout() {
    return this.http.post<void>(`${environment.apiUrl}/api/auth/logout`, null, {
      withCredentials: true,
    });
  }

  resendConfirmation(email: string) {
    return this.http.post<{ message: string }>(
      `${environment.apiUrl}/api/auth/resend-confirmation`,
      { email },
      { withCredentials: true },
    );
  }
}
