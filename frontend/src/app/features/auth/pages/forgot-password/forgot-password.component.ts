import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';

import { AuthShellComponent } from '../../../../shared/auth/components/auth-shell/auth-shell.component';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [AuthShellComponent, ReactiveFormsModule, RouterLink, TranslatePipe],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ForgotPasswordComponent {
  readonly attemptedSubmit = signal(false);
  readonly integrationNoticeVisible = signal(false);

  readonly form = new FormGroup({
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),
  });

  showError(): boolean {
    const control = this.form.controls.email;

    return control.invalid && (control.touched || this.attemptedSubmit());
  }

  submit(): void {
    this.attemptedSubmit.set(true);
    this.integrationNoticeVisible.set(false);

    const email = this.form.controls.email.value.trim();

    this.form.controls.email.setValue(email);

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.integrationNoticeVisible.set(true);
  }
}
