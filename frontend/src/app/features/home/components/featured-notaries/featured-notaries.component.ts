import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

import { NotaryCardComponent } from '../../../../shared/notaries/components/notary-card/notary-card.component';
import { FEATURED_NOTARIES } from '../../data-access/featured-notaries.mock';

@Component({
  selector: 'app-featured-notaries',
  standalone: true,
  imports: [TranslatePipe, NotaryCardComponent],
  templateUrl: './featured-notaries.component.html',
  styleUrl: './featured-notaries.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FeaturedNotariesComponent {
  readonly notaries = FEATURED_NOTARIES;
}
