import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

import { Agence } from '../../../../../shared/agences/models/agence.model';

/** Section « À propos » : présentation et encarts. */
@Component({
  selector: 'app-agence-about',
  standalone: true,
  imports: [TranslatePipe],
  templateUrl: './agence-about.component.html',
  styleUrl: './agence-about.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AgenceAboutComponent {
  readonly agence = input.required<Agence>();

  /** Paragraphes « À propos » ; à défaut, la description courte. */
  readonly paragraphs = computed(() => {
    const { about, description } = this.agence();
    return about?.length ? about : [description];
  });
}
