import { ChangeDetectionStrategy, Component, output, signal, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';

import { Router } from '@angular/router';

import { AuthApiService } from '../../data-access/auth-api.service';

import { AuthShellComponent } from '../../../../shared/auth/components/auth-shell/auth-shell.component';

export type RegistrationAccountType = 'particulier' | 'professionnel';
export type RegistrationProfessionalRole = 'agent' | 'notaire';
export type RegistrationRole = 'utilisateur' | RegistrationProfessionalRole;

/** Modèle de saisie côté interface. */
export interface RegistrationFormValue {
  givenName: string;
  name: string;
  email: string;
  password: string;
  accountType: RegistrationRole;
  conditions: boolean;
}

function samePasswordValidator(control: AbstractControl): ValidationErrors | null {
  const password: string = control.get('password')?.value ?? '';
  const confirmation: string = control.get('confirmPassword')?.value ?? '';
  return password && confirmation && password !== confirmation ? { passwordMismatch: true } : null;
}

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, TranslatePipe, AuthShellComponent],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterComponent {
  private readonly router = inject(Router);
  readonly registerRequested = output<RegistrationFormValue>();

  readonly accountType = signal<RegistrationAccountType>('particulier');
  readonly isPasswordVisible = signal(false);
  readonly attemptedSubmit = signal(false);
  readonly registrationStatus = signal<'idle' | 'loading' | 'success' | 'error'>('idle');

  readonly apiService = inject(AuthApiService);

  readonly form = new FormGroup(
    {
      givenName: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required, Validators.pattern(/\S/), Validators.maxLength(100)],
      }),
      name: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required, Validators.pattern(/\S/), Validators.maxLength(100)],
      }),
      email: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required, Validators.email],
      }),
      password: new FormControl('', {
        nonNullable: true,
        validators: [
          Validators.required,
          Validators.minLength(8),
          Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/),
        ],
      }),
      confirmPassword: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required],
      }),
      professionalRole: new FormControl<RegistrationProfessionalRole | null>(
        { value: null, disabled: true },
        { validators: [Validators.required] },
      ),
      conditions: new FormControl(false, {
        nonNullable: true,
        validators: [Validators.requiredTrue],
      }),
    },
    { validators: samePasswordValidator },
  );

  constructor() {
    this.form.valueChanges
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.registrationStatus.set('idle'));
  }

  get passwordRules(): { minLength: boolean; upper: boolean; lower: boolean; digit: boolean } {
    const value = this.form.controls.password.value;
    return {
      minLength: value.length >= 8,
      upper: /[A-Z]/.test(value),
      lower: /[a-z]/.test(value),
      digit: /\d/.test(value),
    };
  }

  showError(
    controlName:
      | 'givenName'
      | 'name'
      | 'email'
      | 'password'
      | 'confirmPassword'
      | 'conditions'
      | 'professionalRole',
  ): boolean {
    const control = this.form.controls[controlName];
    return control.invalid && (control.touched || this.attemptedSubmit());
  }

  showPasswordMismatch(): boolean {
    return (
      this.form.hasError('passwordMismatch') &&
      (this.form.controls.confirmPassword.touched || this.attemptedSubmit())
    );
  }

  setAccountType(accountType: RegistrationAccountType): void {
    this.accountType.set(accountType);
    const roleControl = this.form.controls.professionalRole;
    if (accountType === 'professionnel') {
      roleControl.enable({ emitEvent: false });
    } else {
      roleControl.reset(null, { emitEvent: false });
      roleControl.disable({ emitEvent: false });
    }
    this.registrationStatus.set('idle');
  }

  togglePasswordVisibility(): void {
    this.isPasswordVisible.update((visible) => !visible);
  }

  submit(): void {
    // Evite de faire plusieurs requêtes si l'utilisateur clique plusieurs fois
    if (this.registrationStatus() === 'loading') return;

    this.attemptedSubmit.set(true);
    this.registrationStatus.set('loading');

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.getRawValue();
    const data: RegistrationFormValue = {
      givenName: value.givenName.trim(),
      name: value.name.trim(),
      email: value.email.trim(),
      password: value.password,
      accountType:
        this.accountType() === 'particulier'
          ? 'utilisateur'
          : (value.professionalRole as RegistrationProfessionalRole),
      conditions: value.conditions,
    };

    this.apiService.postRegisterForm(data).subscribe({
      next: () => {
        this.router.navigate(['/verify-email'], {
          state: {
            email: data.email
          }
        });
        this.registrationStatus.set('success');
      },
      error: (error) => {
        this.registrationStatus.set('error');
      },
    });
  }
}
