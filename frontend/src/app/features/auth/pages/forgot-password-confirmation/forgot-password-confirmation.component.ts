import { Location } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { Router, RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';

import { AuthShellComponent } from '../../../../shared/auth/components/auth-shell/auth-shell.component';

@Component({
  selector: 'app-forgot-password-confirmation',
  standalone: true,
  imports: [AuthShellComponent, RouterLink, TranslatePipe],
  templateUrl: './forgot-password-confirmation.component.html',
  styleUrl: './forgot-password-confirmation.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ForgotPasswordConfirmationComponent {
  private readonly router = inject(Router);
  private readonly location = inject(Location);

  private readonly state = (this.router.currentNavigation()?.extras.state ??
    this.location.getState()) as { email?: unknown } | null;

  readonly email = typeof this.state?.email === 'string' ? this.state.email : '';
}
