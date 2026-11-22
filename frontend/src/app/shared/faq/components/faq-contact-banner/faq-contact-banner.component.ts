import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

/** Bandeau « Vous n'avez pas trouvé votre réponse ? » en bas de la FAQ. */
@Component({
  selector: 'app-faq-contact-banner',
  standalone: true,
  imports: [TranslatePipe],
  templateUrl: './faq-contact-banner.component.html',
  styleUrl: './faq-contact-banner.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FaqContactBannerComponent {}
