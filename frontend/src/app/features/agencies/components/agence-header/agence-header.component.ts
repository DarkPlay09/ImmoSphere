import { ChangeDetectionStrategy, Component, computed, inject, input, signal } from '@angular/core';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';

import { Agence } from '../../../../shared/agences/models/agence.model';
import { AgenceMailtoPipe } from '../../../../shared/agences/pipes/agence-mailto.pipe';
import { formatRating } from '../../../../shared/agences/utils/format-rating';
import { AgenceContactComponent } from '../agence-contact/agence-contact.component';

type Star = 'full' | 'half' | 'empty';

const STAR_COUNT = 5;

/** En-tête du profil : logo, badges, nom, localisation, description, tags, note et coordonnées. */
@Component({
  selector: 'app-agence-header',
  standalone: true,
  imports: [AgenceContactComponent, AgenceMailtoPipe, TranslatePipe],
  templateUrl: './agence-header.component.html',
  styleUrl: './agence-header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AgenceHeaderComponent {
  private readonly translate = inject(TranslateService);

  readonly agence = input.required<Agence>();

  readonly initial = computed(() => this.agence().name.charAt(0).toUpperCase());

  readonly hasBadges = computed(() => {
    const { ipiNumber, federiaMember, bce } = this.agence();
    return Boolean(ipiNumber || federiaMember || bce);
  });

  /** Bloc de note : affiché seulement si la note et le nombre d'avis sont fournis. */
  readonly rating = computed(() => {
    const { rating, reviewCount } = this.agence();
    if (rating === undefined || !reviewCount) {
      return null;
    }

    return {
      label: formatRating(rating, this.translate.currentLang()),
      reviewCount,
      stars: toStars(rating),
    };
  });

  /** Favori local, comme sur la carte d'un bien : non persisté tant que les favoris ne sont pas branchés. */
  readonly isFavorite = signal(false);

  toggleFavorite(): void {
    this.isFavorite.update((value) => !value);
  }
}

/** Étoiles pleines, demi-étoile à partir d'un quart (4,7 → 4 pleines et une demie), puis vides. */
function toStars(rating: number): Star[] {
  return Array.from({ length: STAR_COUNT }, (_, index): Star => {
    const rest = rating - index;
    if (rest >= 0.75) {
      return 'full';
    }
    return rest >= 0.25 ? 'half' : 'empty';
  });
}
