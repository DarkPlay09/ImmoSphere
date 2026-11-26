import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';

import { Agence } from '../../models/agence.model';
import { AgenceMailtoPipe } from '../../pipes/agence-mailto.pipe';
import { formatRating } from '../../utils/format-rating';

@Component({
  selector: 'app-agence-card',
  standalone: true,
  imports: [AgenceMailtoPipe, RouterLink, TranslatePipe],
  templateUrl: './agence-card.component.html',
  styleUrl: './agence-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AgenceCardComponent {
  private readonly translate = inject(TranslateService);

  readonly agence = input.required<Agence>();

  readonly location = computed(() => {
    const { city, district } = this.agence();
    return district ? `${city} · ${district}` : city;
  });

  readonly rating = computed(() => {
    const rating = this.agence().rating;
    return rating === undefined ? null : formatRating(rating, this.translate.currentLang());
  });

  /** Première lettre du nom, affichée dans le placeholder du logo. */
  readonly initial = computed(() => this.agence().name.charAt(0).toUpperCase());

  /** Nombre d'avis affiché seulement s'il est renseigné et non nul. */
  readonly reviewCount = computed(() => this.agence().reviewCount || null);

  /** Nombre de biens affiché seulement s'il est renseigné et non nul (l'API renvoie 0 sans bien). */
  readonly propertyCount = computed(() => this.agence().propertyCount || null);

  readonly hasReviews = computed(() => this.rating() !== null || this.reviewCount() !== null);

  /** La ligne note / avis / biens n'est affichée que si au moins une donnée est présente. */
  readonly hasStats = computed(() => this.hasReviews() || this.propertyCount() !== null);
}
