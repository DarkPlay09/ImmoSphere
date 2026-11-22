import { ChangeDetectionStrategy, Component, inject, output, signal } from '@angular/core';

import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { Router } from '@angular/router';

import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';

import { AuthShellComponent } from '../../../../shared/auth/components/auth-shell/auth-shell.component';

import { AuthApiService } from '../../data-access/auth-api.service';

import { AuthSessionService } from '../../data-access/auth-session.service';


export interface LoginFormValue {
  email: string;
  password: string;
  rememberMe: boolean;
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [AuthShellComponent, ReactiveFormsModule, RouterLink, TranslatePipe],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {
  readonly loginRequested = output<LoginFormValue>();

  readonly attemptedSubmit = signal(false);
  readonly isPasswordVisible = signal(false);
  readonly integrationNoticeVisible = signal(false);

  readonly apiService = inject(AuthApiService);
  private readonly router = inject(Router);
  private readonly authSession = inject(AuthSessionService);

  readonly form = new FormGroup({
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),

    password: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),

    rememberMe: new FormControl(false, {
      nonNullable: true,
    }),
  });

  constructor() {
    this.form.valueChanges.pipe(takeUntilDestroyed()).subscribe(() => {
      this.integrationNoticeVisible.set(false);
    });
  }

  showError(field: 'email' | 'password'): boolean {
    const control = this.form.controls[field];

    return control.invalid && (control.touched || this.attemptedSubmit());
  }

  togglePasswordVisibility(): void {
    this.isPasswordVisible.update((visible) => !visible);
  }

  submit(): void {
    this.attemptedSubmit.set(true);

    const email = this.form.controls.email.value.trim();

    this.form.controls.email.setValue(email, {
      emitEvent: false,
    });

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.getRawValue();

    const data: LoginFormValue = {
      email: value.email.trim(),
      password: value.password.trim(),
      rememberMe: value.rememberMe,
    };

    // A quoi sert ce morceau de code ? Je peux le supprimer ?
    this.loginRequested.emit({
      email: value.email,
      password: value.password,
      rememberMe: value.rememberMe,
    });

    this.apiService.postLoginForm(data).subscribe({
      next: () => {
        this.authSession.refresh();
        this.router.navigateByUrl('/');
      },
      error: (error) => {}, // TODO Afficher message d'erreur
    });

    // // En attente de l'intégration avec le backend.
    // this.integrationNoticeVisible.set(true);
  }
}
