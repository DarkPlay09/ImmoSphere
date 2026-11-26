import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

import { AgenceSpecifications } from '../../models/agence.model';

/** Carte « Spécifications de l'agence ». */
@Component({
  selector: 'app-agence-specs',
  standalone: true,
  imports: [TranslatePipe],
  templateUrl: './agence-specs.component.html',
  styleUrl: './agence-specs.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AgenceSpecsComponent {
  readonly specifications = input.required<AgenceSpecifications>();
}
