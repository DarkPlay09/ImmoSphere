import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';

/**
 * Enveloppe visuelle commune aux pages d'authentification.
 */
@Component({
  selector: 'app-auth-shell',
  standalone: true,
  imports: [NgOptimizedImage, RouterLink, TranslatePipe],
  templateUrl: './auth-shell.component.html',
  styleUrl: './auth-shell.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthShellComponent {
  readonly year = new Date().getFullYear();

  readonly showFooter = input(true);
}
