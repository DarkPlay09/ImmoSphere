import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

/** Élément de la pagination : un numéro de page ou des points de suspension. */
export type PaginationItem = number | 'ellipsis';

@Component({
  selector: 'app-agences-pagination',
  standalone: true,
  imports: [TranslatePipe],
  templateUrl: './agences-pagination.component.html',
  styleUrl: './agences-pagination.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AgencesPaginationComponent {
  readonly page = input.required<number>();
  readonly pageCount = input.required<number>();

  readonly pageChange = output<number>();

  readonly items = computed(() => buildPagination(this.page(), this.pageCount()));

  goTo(page: number): void {
    if (page >= 1 && page <= this.pageCount() && page !== this.page()) {
      this.pageChange.emit(page);
    }
  }
}

/**
 * Pages affichées : toujours la première et la dernière, la page courante et ses voisines,
 * des points de suspension entre les deux (ex. 1 2 3 4 … 8).
 */
export function buildPagination(page: number, pageCount: number): PaginationItem[] {
  if (pageCount <= 7) {
    return Array.from({ length: pageCount }, (_, index) => index + 1);
  }

  let start = Math.max(2, page - 1);
  let end = Math.min(pageCount - 1, page + 1);

  if (page <= 3) {
    start = 2;
    end = 4;
  } else if (page >= pageCount - 2) {
    start = pageCount - 3;
    end = pageCount - 1;
  }

  const items: PaginationItem[] = [1];
  if (start > 2) items.push('ellipsis');
  for (let current = start; current <= end; current++) items.push(current);
  if (end < pageCount - 1) items.push('ellipsis');
  items.push(pageCount);

  return items;
}
