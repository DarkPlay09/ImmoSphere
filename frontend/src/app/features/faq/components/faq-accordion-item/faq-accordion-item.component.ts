import { ChangeDetectionStrategy, Component, computed, input, signal } from '@angular/core';

import { FaqQuestion } from '../../models/faq.model';
import { FaqAnswerRatingComponent } from '../faq-answer-rating/faq-answer-rating.component';

/**
 * Question de la FAQ en accordéon (US 7.1) : un clic sur la question affiche ou masque la réponse
 * et fait tourner la flèche. Chaque question s'ouvre indépendamment des autres.
 */
@Component({
  selector: 'app-faq-accordion-item',
  standalone: true,
  imports: [FaqAnswerRatingComponent],
  templateUrl: './faq-accordion-item.component.html',
  styleUrl: './faq-accordion-item.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FaqAccordionItemComponent {
  readonly item = input.required<FaqQuestion>();

  readonly expanded = signal(false);

  readonly toggleId = computed(() => `faq-question-${this.item().id}`);
  readonly answerId = computed(() => `faq-answer-${this.item().id}`);

  toggle(): void {
    this.expanded.update((expanded) => !expanded);
  }
}
