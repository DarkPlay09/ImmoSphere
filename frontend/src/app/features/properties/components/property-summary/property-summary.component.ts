import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { map, startWith } from 'rxjs';

import { BienDetailResponseDto } from '../../data-access/property-detail-response.model';

interface SummaryFact {
  readonly labelKey: string;
  readonly value?: string;
  readonly valueKey?: string;
  readonly valueParams?: Readonly<Record<string, string | number>>;
}

const LOCALES_BY_LANGUAGE: Readonly<Record<string, string>> = {
  fr: 'fr-BE',
  nl: 'nl-BE',
  de: 'de-BE',
  en: 'en-BE',
};

@Component({
  selector: 'app-property-summary',
  imports: [TranslatePipe],
  templateUrl: './property-summary.component.html',
  styleUrl: './property-summary.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PropertySummaryComponent {
  private readonly translate = inject(TranslateService);
  private readonly language = toSignal(
    this.translate.onLangChange.pipe(
      map(({ lang }) => lang),
      startWith(this.translate.currentLang() || 'fr'),
    ),
    { initialValue: 'fr' },
  );

  readonly property = input.required<BienDetailResponseDto>();

  readonly formattedPrice = computed(() =>
    new Intl.NumberFormat(LOCALES_BY_LANGUAGE[this.language()] ?? 'fr-BE', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0,
    }).format(this.property().prix),
  );

  readonly publicAddress = computed(() => {
    this.language();
    const property = this.property();
    const locality = `${property.codePostal} ${property.localite}`;

    if (property.adresseConfidentielle || !property.rue || property.numero === null) {
      return locality;
    }

    const box = property.boite
      ? ` ${this.translate.instant('propertyDetail.summary.box')} ${property.boite}`
      : '';
    return `${property.rue} ${property.numero}${box}, ${locality}`;
  });

  readonly facts = computed<readonly SummaryFact[]>(() => {
    const characteristics = this.property().caracteristiques;

    return [
      {
        labelKey: 'propertyDetail.summary.facts.bedrooms',
        value: String(characteristics.nombreChambres),
      },
      {
        labelKey: 'propertyDetail.summary.facts.bathrooms',
        value: String(characteristics.nombreSallesDeBain),
      },
      {
        labelKey: 'propertyDetail.summary.facts.livingArea',
        valueKey: 'propertyDetail.values.area',
        valueParams: { value: characteristics.surfaceHabitable },
      },
      {
        labelKey: 'propertyDetail.summary.facts.floor',
        value: String(characteristics.etage),
      },
      { labelKey: 'propertyDetail.summary.facts.peb', value: this.property().peb },
      {
        labelKey: 'propertyDetail.summary.facts.consumption',
        valueKey: 'propertyDetail.values.energyConsumption',
        valueParams: { value: characteristics.consommationEnergie },
      },
    ];
  });
}
