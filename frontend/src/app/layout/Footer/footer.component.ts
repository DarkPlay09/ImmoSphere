import { Component, computed, inject } from '@angular/core';
import { RouterLink } from "@angular/router";
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { LANGUAGES } from '../../core/i18n/languages.data';
import type { LanguageCode } from '../../core/i18n/language.model';
import { LanguagePickerComponent } from '../LanguagePicker/language-picker.component';

// Sans route, le template affiche le libellé comme du texte.
interface FooterLink {
  labelKey: string;
  route?: string;
  // Ajoute un paramètre à la route pour distinguer la vente de la location.
  transaction?: 'sale' | 'rent';
}

interface FooterGroup {
  titleKey: string;
  links: FooterLink[];
}

@Component({
  selector: 'app-footer',
  standalone: true,
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss',
  imports: [TranslatePipe, RouterLink, LanguagePickerComponent],
})

export class FooterComponent {
  private readonly translate = inject(TranslateService);

  readonly languages = LANGUAGES;
  // Suit la langue du site, y compris quand elle change depuis la navbar.
  readonly language = computed(() => this.translate.currentLang() ?? 'fr');
  readonly year = new Date().getFullYear();

  // Chaque groupe représente une colonne. Le template traduit les clés de titre et de lien.
  readonly groups: FooterGroup[] = [
    {
      titleKey: 'footer.about.title',
      links: [
        { labelKey: 'footer.about.aboutUs' },
        { labelKey: 'footer.about.howItWorks' },
        { labelKey: 'footer.about.faq' },
      ],
    },
    {
      titleKey: 'footer.properties.title',
      links: [
        { labelKey: 'navbar.buy', route: '/properties', transaction: 'sale' },
        { labelKey: 'navbar.rent', route: '/properties', transaction: 'rent' },
        { labelKey: 'navbar.publish' },
        { labelKey: 'footer.properties.mapSearch' },
      ],
    },
    {
      titleKey: 'footer.professionals.title',
      links: [
        { labelKey: 'footer.professionals.agencies' },
        { labelKey: 'footer.professionals.agents' },
        { labelKey: 'navbar.notaries' },
        { labelKey: 'footer.professionals.portal' },
      ],
    },
    {
      titleKey: 'footer.help.title',
      links: [
        { labelKey: 'footer.help.center' },
        { labelKey: 'footer.help.contact' },
        { labelKey: 'footer.help.terms' },
        { labelKey: 'footer.help.privacy' },
        { labelKey: 'footer.help.cookies' },
        { labelKey: 'footer.help.accessibility' },
      ],
    },
  ];

  // Les boutons sur ordinateur changent la langue via le service de traduction commun.
  changeLanguage(code: LanguageCode): void {
    this.translate.use(code).subscribe({
      error: (error: unknown) => {
        console.error('Impossible de changer la langue', error);
      },
    });
  }

}
