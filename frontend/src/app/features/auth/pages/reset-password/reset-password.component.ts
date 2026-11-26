import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';

import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';

import { ActivatedRoute, RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { AuthShellComponent } from '../../../../shared/auth/components/auth-shell/auth-shell.component';

function samePasswordValidator(control: AbstractControl): ValidationErrors | null {
  const password = control.get('password')?.value ?? '';
  const confirmation = control.get('confirmPassword')?.value ?? '';

  return password && confirmation && password !== confirmation ? { passwordMismatch: true } : null;
}

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [AuthShellComponent, ReactiveFormsModule, RouterLink, TranslatePipe],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResetPasswordComponent {
  private readonly route = inject(ActivatedRoute);

  private readonly token = signal<string | null>(null);
  private readonly email = signal<string | null>(null);

  readonly attemptedSubmit = signal(false);
  readonly isPasswordVisible = signal(false);
  readonly isConfirmationVisible = signal(false);
  readonly integrationNoticeVisible = signal(false);
  readonly hasResetLink = signal(false);

  readonly form = new FormGroup(
    {
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
    },
    {
      validators: samePasswordValidator,
    },
  );

  constructor() {
    this.route.queryParamMap.pipe(takeUntilDestroyed()).subscribe((params) => {
      this.token.set(params.get('token'));
      this.email.set(params.get('email'));

      this.hasResetLink.set(Boolean(this.token() && this.email()));

      this.form.reset();
      this.attemptedSubmit.set(false);
      this.integrationNoticeVisible.set(false);
    });

    this.form.valueChanges.pipe(takeUntilDestroyed()).subscribe(() => {
      this.integrationNoticeVisible.set(false);
    });
  }

  get passwordRules() {
    const value = this.form.controls.password.value;

    return {
      minLength: value.length >= 8,
      upper: /[A-Z]/.test(value),
      lower: /[a-z]/.test(value),
      digit: /\d/.test(value),
    };
  }

  showError(field: 'password' | 'confirmPassword'): boolean {
    const control = this.form.controls[field];

    return control.invalid && (control.touched || this.attemptedSubmit());
  }

  showPasswordMismatch(): boolean {
    return (
      this.form.hasError('passwordMismatch') &&
      (this.form.controls.confirmPassword.touched || this.attemptedSubmit())
    );
  }

  togglePasswordVisibility(): void {
    this.isPasswordVisible.update((visible) => !visible);
  }

  toggleConfirmationVisibility(): void {
    this.isConfirmationVisible.update((visible) => !visible);
  }

  submit(): void {
    this.attemptedSubmit.set(true);
    this.integrationNoticeVisible.set(false);

    if (!this.hasResetLink()) {
      return;
    }

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.integrationNoticeVisible.set(true);
  }
}
