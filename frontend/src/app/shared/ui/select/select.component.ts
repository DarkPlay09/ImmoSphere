import { Component, computed, ElementRef, inject, input, output, signal } from '@angular/core';

export interface SelectOption<T extends string | number = string> {
  value: T;
  label: string;
  lang?: string;
}

@Component({
  selector: 'app-select',
  standalone: true,
  templateUrl: './select.component.html',
  styleUrl: './select.component.scss',
  host: {
    '[class.select--above]': "placement() === 'above'",
    '(document:click)': 'onDocumentClick($event)',
    '(focusout)': 'onFocusOut($event)',
  },
})
export class SelectComponent<T extends string | number> {
  private readonly element = inject(ElementRef<HTMLElement>);

  readonly options = input.required<readonly SelectOption<T>[]>();
  readonly value = input<T | null>(null);
  readonly label = input.required<string>();
  readonly placeholder = input('');
  readonly placement = input<'above' | 'below'>('below');

  readonly valueChange = output<T>();
  readonly isOpen = signal(false);
  readonly selectedOption = computed(() =>
    this.options().find((option) => option.value === this.value()),
  );

  toggle(): void {
    this.isOpen.update((open) => !open);
  }

  selectOption(value: T, trigger: HTMLButtonElement): void {
    trigger.focus();
    this.isOpen.set(false);
    this.valueChange.emit(value);
  }

  closeOnEscape(event: Event, trigger: HTMLButtonElement): void {
    if (this.isOpen()) {
      event.stopPropagation();
      trigger.focus();
      this.isOpen.set(false);
    }
  }

  onDocumentClick(event: MouseEvent): void {
    if (event.target instanceof Node && !this.element.nativeElement.contains(event.target)) {
      this.isOpen.set(false);
    }
  }

  onFocusOut(event: FocusEvent): void {
    const next = event.relatedTarget;

    if (!(next instanceof Node) || !this.element.nativeElement.contains(next)) {
      this.isOpen.set(false);
    }
  }
}
