import { ChangeDetectionStrategy, Component, computed, input, model } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

import { FaqCategory } from '../../models/faq.model';
import { FAQ_ALL_CATEGORIES_ICON, faqCategoryIconMask } from '../../utils/faq-category-icon';

/** Entrée de la navigation : `code` vaut `null` pour « Toutes les questions ». */
interface FaqCategoryNavItem {
  code: string | null;
  labelKey: string;
  icon: string;
  count: number;
}

/**
 * Navigation par catégorie de la FAQ (colonne de gauche) : « Toutes les questions » puis chaque
 * catégorie avec son nombre de questions. La catégorie choisie est exposée dans `selected`
 * (`null` pour toutes).
 */
@Component({
  selector: 'app-faq-category-nav',
  standalone: true,
  imports: [TranslatePipe],
  templateUrl: './faq-category-nav.component.html',
  styleUrl: './faq-category-nav.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FaqCategoryNavComponent {
  readonly categories = input.required<readonly FaqCategory[]>();

  /** Nombre de questions trouvées, questions sans catégorie comprises. */
  readonly totalCount = input.required<number>();

  readonly selected = model<string | null>(null);

  readonly items = computed<FaqCategoryNavItem[]>(() => [
    {
      code: null,
      labelKey: 'faq.allCategories',
      icon: faqCategoryIconMask(FAQ_ALL_CATEGORIES_ICON),
      count: this.totalCount(),
    },
    ...this.categories().map((category) => ({
      code: category.code,
      labelKey: `faq.categories.${category.code}`,
      icon: faqCategoryIconMask(category.code),
      count: category.questionCount,
    })),
  ]);

  readonly totalKey = computed(() => (this.totalCount() === 1 ? 'faq.categoryNav.countOne' : 'faq.categoryNav.count'));

  select(code: string | null): void {
    this.selected.set(code);
  }
}
