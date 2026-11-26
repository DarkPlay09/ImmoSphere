import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

import { PebRating, parsePebRating } from '../../models/peb-rating.model';

type PebBadgeSize = 'small' | 'medium' | 'large';

const RATING_CLASS: Readonly<Record<PebRating, string>> = {
  'A++': 'peb-badge--a-double-plus',
  'A+': 'peb-badge--a-plus',
  A: 'peb-badge--a',
  B: 'peb-badge--b',
  C: 'peb-badge--c',
  D: 'peb-badge--d',
  E: 'peb-badge--e',
  F: 'peb-badge--f',
  G: 'peb-badge--g',
};

@Component({
  selector: 'app-peb-badge',
  imports: [NgClass],
  templateUrl: './peb-badge.component.html',
  styleUrl: './peb-badge.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PebBadgeComponent {
  readonly rating = input.required<string>();
  readonly size = input<PebBadgeSize>('medium');

  readonly normalizedRating = computed(() =>
    parsePebRating(this.rating()) ?? this.rating().trim().toUpperCase(),
  );

  readonly classes = computed(() => {
    const rating = parsePebRating(this.rating());

    return [
      `peb-badge--${this.size()}`,
      rating ? RATING_CLASS[rating] : 'peb-badge--unknown',
    ];
  });
}
