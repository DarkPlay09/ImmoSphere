import { Component, computed, inject, input } from '@angular/core';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';

import { LANGUAGES } from '../../core/i18n/languages.data';
import type { LanguageCode } from '../../core/i18n/language.model';
import { SelectComponent, type SelectOption } from '../../shared/ui/select/select.component';

@Component({
  selector: 'app-language-picker',
  imports: [TranslatePipe, SelectComponent],
  templateUrl: './language-picker.component.html',
  styleUrl: './language-picker.component.scss',
  host: {
    '[class.language-picker--footer]': "variant() === 'footer'",
  },
})
export class LanguagePickerComponent {
  private readonly translate = inject(TranslateService);

  readonly variant = input<'navbar' | 'footer'>('navbar');

  readonly options: readonly SelectOption<LanguageCode>[] = LANGUAGES.map(
    ({ code, label }) => ({ value: code, label, lang: code }),
  );

  readonly language = computed(() => {
    const current = this.translate.currentLang();
    return LANGUAGES.find(({ code }) => code === current)?.code ?? 'fr';
  });

  selectLanguage(code: LanguageCode): void {
    this.translate.use(code).subscribe({
      error: (error: unknown) => {
        console.error('Impossible de changer la langue', error);
      },
    });
  }
}
