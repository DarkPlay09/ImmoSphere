import { ChangeDetectionStrategy, Component, model, output } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

import { FAQ_SEARCH_MAX_LENGTH } from '../../models/faq.model';

/**
 * Barre de recherche de la FAQ. Le texte saisi est exposé à chaque frappe (`term`) ;
 * le bouton « Rechercher » demande une recherche immédiate (`searched`).
 */
@Component({
  selector: 'app-faq-search-bar',
  standalone: true,
  imports: [TranslatePipe],
  templateUrl: './faq-search-bar.component.html',
  styleUrl: './faq-search-bar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FaqSearchBarComponent {
  readonly term = model('');

  readonly searched = output<void>();

  readonly maxLength = FAQ_SEARCH_MAX_LENGTH;

  submit(event: Event): void {
    event.preventDefault();
    this.searched.emit();
  }

  readValue(event: Event): string {
    return (event.target as HTMLInputElement).value;
  }
}
