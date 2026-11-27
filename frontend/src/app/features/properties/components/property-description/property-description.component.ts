import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnDestroy,
  input,
  signal,
  viewChild,
} from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

const COLLAPSED_CONTENT_HEIGHT = 192;

@Component({
  selector: 'app-property-description',
  imports: [TranslatePipe],
  templateUrl: './property-description.component.html',
  styleUrl: './property-description.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PropertyDescriptionComponent implements OnDestroy {
  readonly description = input.required<string>();
  readonly expanded = signal(false);
  readonly overflowing = signal(false);

  private readonly content = viewChild.required<ElementRef<HTMLElement>>('descriptionContent');
  private resizeObserver?: ResizeObserver;

  constructor() {
    afterNextRender(() => {
      const element = this.content().nativeElement;
      const updateOverflow = () => {
        this.overflowing.set(element.scrollHeight > COLLAPSED_CONTENT_HEIGHT + 1);
      };

      this.resizeObserver = new ResizeObserver(updateOverflow);
      this.resizeObserver.observe(element);
      updateOverflow();
    });
  }

  toggleExpanded(): void {
    this.expanded.update((expanded) => !expanded);
  }

  ngOnDestroy(): void {
    this.resizeObserver?.disconnect();
  }
}
