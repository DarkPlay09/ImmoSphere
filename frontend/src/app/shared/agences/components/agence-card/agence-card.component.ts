import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';

import { Agence } from '../../models/agence.model';
import { formatRating } from '../../utils/format-rating';

@Component({
  selector: 'app-agence-card',
  standalone: true,
  imports: [RouterLink, TranslatePipe],
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

  readonly hasStats = computed(() => {
    const { rating, reviewCount, propertyCount } = this.agence();
    return rating !== undefined || reviewCount !== undefined || propertyCount !== undefined;
  });
}
