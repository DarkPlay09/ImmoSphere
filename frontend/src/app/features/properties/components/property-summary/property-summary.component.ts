import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { map, startWith } from 'rxjs';

import { BienDetailResponseDto } from '../../data-access/property-detail-response.model';

interface SummaryFact {
  readonly labelKey: string;
  readonly icon?: string;
  readonly peb?: boolean;
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
    const locality = `${property.localite} ${property.codePostal}`;

    if (property.adresseConfidentielle || !property.rue || property.numero === null) {
      return locality;
    }

    const box = property.boite
      ? ` ${this.translate.instant('propertyDetail.summary.box')} ${property.boite}`
      : '';
    return `${locality} · ${property.rue} ${property.numero}${box}`;
  });

  readonly facts = computed<readonly SummaryFact[]>(() => {
    const characteristics = this.property().caracteristiques;

    return [
      {
        labelKey: 'propertyDetail.summary.facts.bedrooms',
        icon: 'icons/property-detail/bedrooms.svg',
        value: String(characteristics.nombreChambres),
      },
      {
        labelKey: 'propertyDetail.summary.facts.bathrooms',
        icon: 'icons/property-detail/bathroom.svg',
        value: String(characteristics.nombreSallesDeBain),
      },
      {
        labelKey: 'propertyDetail.summary.facts.livingArea',
        icon: 'icons/property-detail/area.svg',
        valueKey: 'propertyDetail.values.area',
        valueParams: { value: characteristics.surfaceHabitable },
      },
      {
        labelKey: 'propertyDetail.summary.facts.terrace',
        icon: 'icons/property-detail/terrace.svg',
        valueKey: 'propertyDetail.values.area',
        valueParams: { value: characteristics.surfaceTerrasse },
      },
      {
        labelKey: 'propertyDetail.summary.facts.floor',
        icon: 'icons/property-detail/floor.svg',
        value: `${characteristics.etage} / ${characteristics.nombreEtages}`,
      },
      {
        labelKey: 'propertyDetail.summary.facts.elevator',
        icon: 'icons/property-detail/elevator.svg',
        valueKey: this.property().equipements.ascenseur
          ? 'propertyDetail.values.yes'
          : 'propertyDetail.values.no',
      },
      {
        labelKey: 'propertyDetail.summary.facts.peb',
        peb: true,
        value: `PEB ${this.property().peb}`,
        valueKey: 'propertyDetail.values.energyConsumption',
        valueParams: { value: characteristics.consommationEnergie },
      },
    ];
  });
}
