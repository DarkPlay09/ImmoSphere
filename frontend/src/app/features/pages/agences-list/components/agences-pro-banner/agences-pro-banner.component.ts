import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

/** Bandeau « Vous êtes une agence immobilière en Belgique ? ». */
@Component({
  selector: 'app-agences-pro-banner',
  standalone: true,
  imports: [TranslatePipe],
  templateUrl: './agences-pro-banner.component.html',
  styleUrl: './agences-pro-banner.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AgencesProBannerComponent {}
