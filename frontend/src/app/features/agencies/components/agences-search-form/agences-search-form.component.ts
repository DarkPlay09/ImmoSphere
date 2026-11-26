import { ChangeDetectionStrategy, Component, model, output } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

import { AgenceRegion } from '../../models/agence.model';

/** Formulaire de recherche de la page liste (nom, localisation, région). */
@Component({
  selector: 'app-agences-search-form',
  standalone: true,
  imports: [TranslatePipe],
  templateUrl: './agences-search-form.component.html',
  styleUrl: './agences-search-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AgencesSearchFormComponent {
  readonly name = model('');
  readonly location = model('');
  readonly region = model<AgenceRegion | 'all'>('all');

  readonly searched = output<void>();
  readonly resetRequested = output<void>();

  readonly regions: AgenceRegion[] = ['brussels', 'flanders', 'wallonia'];

  submit(event: Event): void {
    event.preventDefault();
    this.searched.emit();
  }

  readValue(event: Event): string {
    return (event.target as HTMLInputElement | HTMLSelectElement).value;
  }

  /** Les options du select ne proposent que « all » et les régions de `regions`. */
  readRegion(event: Event): AgenceRegion | 'all' {
    return this.readValue(event) as AgenceRegion | 'all';
  }
}
