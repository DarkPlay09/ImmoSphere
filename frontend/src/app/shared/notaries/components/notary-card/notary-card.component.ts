import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

import { Notary } from '../../models/notary.model';

@Component({
  selector: 'app-notary-card',
  standalone: true,
  imports: [TranslatePipe],
  templateUrl: './notary-card.component.html',
  styleUrl: './notary-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotaryCardComponent {
  readonly notary = input.required<Notary>();
}
