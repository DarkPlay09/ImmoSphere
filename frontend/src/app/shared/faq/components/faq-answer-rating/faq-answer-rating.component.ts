import { ChangeDetectionStrategy, Component, computed, input, signal } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

export type FaqRating = 'useful' | 'notUseful';

/**
 * « Cette réponse vous a-t-elle été utile ? » (maquette). État local uniquement :
 * rien n'est envoyé ni stocké. Un second clic sur le même bouton retire l'évaluation.
 */
@Component({
  selector: 'app-faq-answer-rating',
  standalone: true,
  imports: [TranslatePipe],
  templateUrl: './faq-answer-rating.component.html',
  styleUrl: './faq-answer-rating.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FaqAnswerRatingComponent {
  /** Sert uniquement à rendre unique l'identifiant du libellé. */
  readonly questionId = input.required<number>();

  readonly rating = signal<FaqRating | null>(null);

  readonly labelId = computed(() => `faq-rating-label-${this.questionId()}`);

  rate(rating: FaqRating): void {
    this.rating.update((current) => (current === rating ? null : rating));
  }
}
