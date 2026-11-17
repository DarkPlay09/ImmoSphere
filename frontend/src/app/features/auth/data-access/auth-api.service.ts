import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../environments/environments';

import type { RegistrationFormValue } from '../pages/register/register.component';

@Injectable({
  providedIn: 'root',
})
export class AuthApiService {
  private readonly http = inject(HttpClient);

  postRegisterForm(data: RegistrationFormValue) {
    return this.http.post(`${environment.apiUrl}/api/auth/register`, data);
  }
}
