import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

import { FaqQuestionGroup } from '../../models/faq.model';
import { faqCategoryIconMask } from '../../utils/faq-category-icon';
import { FaqAccordionItemComponent } from '../faq-accordion-item/faq-accordion-item.component';

/** Groupe de questions d'une catégorie (ou « Autres » sans catégorie), avec son titre. */
@Component({
  selector: 'app-faq-question-group',
  standalone: true,
  imports: [FaqAccordionItemComponent, TranslatePipe],
  templateUrl: './faq-question-group.component.html',
  styleUrl: './faq-question-group.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FaqQuestionGroupComponent {
  readonly group = input.required<FaqQuestionGroup>();

  private readonly code = computed(() => this.group().categoryCode);

  readonly titleKey = computed(() => {
    const code = this.code();
    return code ? `faq.categories.${code}` : 'faq.otherCategory';
  });

  /** Le groupe « Autres » n'a pas d'icône dans la maquette. */
  readonly icon = computed(() => {
    const code = this.code();
    return code ? faqCategoryIconMask(code) : null;
  });

  readonly headingId = computed(() => `faq-group-${this.code() ?? 'other'}`);
}
