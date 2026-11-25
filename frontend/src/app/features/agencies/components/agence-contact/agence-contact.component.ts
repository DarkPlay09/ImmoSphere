import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

import { Agence } from '../../../../shared/agences/models/agence.model';

/** Bandeau des coordonnées : adresse, téléphone, horaires, site web. */
@Component({
  selector: 'app-agence-contact',
  standalone: true,
  imports: [TranslatePipe],
  templateUrl: './agence-contact.component.html',
  styleUrl: './agence-contact.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AgenceContactComponent {
  readonly agence = input.required<Agence>();

  /** « Quai de la Meuse 48, 4000 Liège » */
  readonly fullAddress = computed(() => {
    const { street, number, postalCode, city } = this.agence();
    const streetLine = [street, number].filter(Boolean).join(' ');
    const cityLine = `${postalCode} ${city}`;
    return streetLine ? `${streetLine}, ${cityLine}` : cityLine;
  });

  /** Numéro sans espaces pour le lien `tel:`. */
  readonly phoneHref = computed(() => `tel:${(this.agence().phone ?? '').replace(/\s+/g, '')}`);

  /** Adresse du site sans protocole ni barre finale, pour l'affichage. */
  readonly websiteLabel = computed(() =>
    (this.agence().website ?? '').replace(/^https?:\/\//, '').replace(/\/$/, ''),
  );
}
