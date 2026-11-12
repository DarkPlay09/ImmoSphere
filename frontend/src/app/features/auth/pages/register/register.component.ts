import { ChangeDetectionStrategy, Component, output, signal } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';

import { AuthShellComponent } from '../../../../shared/auth/components/auth-shell/auth-shell.component';

export type RegistrationAccountType = 'particulier' | 'professionnel';

/** Modèle de saisie côté interface. */
export interface RegistrationFormValue {
  givenName: string;
  name: string;
  email: string;
  password: string;
  accountType: RegistrationAccountType;
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
  readonly registerRequested = output<RegistrationFormValue>();

  readonly accountType = signal<RegistrationAccountType>('particulier');
  readonly isPasswordVisible = signal(false);
  readonly attemptedSubmit = signal(false);
  readonly isLocallyValid = signal(false);

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
      conditions: new FormControl(false, {
        nonNullable: true,
        validators: [Validators.requiredTrue],
      }),
    },
    { validators: samePasswordValidator },
  );

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
    controlName: 'givenName' | 'name' | 'email' | 'password' | 'confirmPassword' | 'conditions',
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
    this.isLocallyValid.set(false);
  }

  togglePasswordVisibility(): void {
    this.isPasswordVisible.update((visible) => !visible);
  }

  submit(): void {
    this.attemptedSubmit.set(true);
    this.isLocallyValid.set(false);

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.getRawValue();
    this.registerRequested.emit({
      givenName: value.givenName.trim(),
      name: value.name.trim(),
      email: value.email.trim(),
      password: value.password,
      accountType: this.accountType(),
      conditions: value.conditions,
    });

    this.isLocallyValid.set(true);
  }
}
