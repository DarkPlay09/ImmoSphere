import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

import { Agence } from '../../../../../shared/agences/models/agence.model';
import { AgenceContactComponent } from '../agence-contact/agence-contact.component';

/** En-tête du profil : logo, badges, nom, localisation, description, tags et coordonnées. */
@Component({
  selector: 'app-agence-header',
  standalone: true,
  imports: [AgenceContactComponent, TranslatePipe],
  templateUrl: './agence-header.component.html',
  styleUrl: './agence-header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AgenceHeaderComponent {
  readonly agence = input.required<Agence>();

  readonly initial = computed(() => this.agence().name.charAt(0).toUpperCase());

  readonly hasBadges = computed(() => {
    const { ipiNumber, federiaMember, bce } = this.agence();
    return Boolean(ipiNumber || federiaMember || bce);
  });
}
