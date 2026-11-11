import { Component, computed, ElementRef, inject, input, signal } from '@angular/core';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';

import { LANGUAGES } from '../../core/i18n/languages.data';
import type { LanguageCode } from '../../core/i18n/language.model';

@Component({
  selector: 'app-language-picker',
  imports: [TranslatePipe],
  templateUrl: './language-picker.component.html',
  styleUrl: './language-picker.component.scss',
  host: {
    '[class.language-picker--footer]': "variant() === 'footer'",
    '(document:click)': 'onDocumentClick($event)',
    '(focusout)': 'onFocusOut($event)',
  },
})
export class LanguagePickerComponent {
  private readonly element = inject(ElementRef<HTMLElement>);
  private readonly translate = inject(TranslateService);

  readonly variant = input<'navbar' | 'footer'>('navbar');
  readonly languages = LANGUAGES;
  readonly language = computed(() => this.translate.currentLang() ?? 'fr');
  readonly isOpen = signal(false);

  toggle(): void {
    this.isOpen.update((isOpen) => !isOpen);
  }

  selectLanguage(code: LanguageCode, trigger: HTMLButtonElement): void {
    this.translate.use(code).subscribe({
      next: () => {
        if (this.isOpen()) {
          trigger.focus();
          this.isOpen.set(false);
        }
      },
      error: (error: unknown) => {
        console.error('Impossible de changer la langue', error);
      },
    });
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
    if (!(event.relatedTarget instanceof Node) ||
        !this.element.nativeElement.contains(event.relatedTarget)) {
      this.isOpen.set(false);
    }
  }
}
