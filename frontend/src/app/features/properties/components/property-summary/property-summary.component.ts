import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { map, startWith } from 'rxjs';

import { PebBadgeComponent } from '../../../../shared/properties/components/peb-badge/peb-badge.component';
import { BienDetailResponseDto } from '../../data-access/property-detail-response.model';

interface SummaryFact {
  readonly labelKey: string;
  readonly icon?: string;
  readonly pebRating?: string;
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
  imports: [TranslatePipe, PebBadgeComponent],
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
    const property = this.property();
    const prioritizedFacts = this.buildPrioritizedFacts(property);
    const peb = this.buildPebFact(property);
    const maximumFactsBeforePeb = peb ? 6 : 7;

    return [...prioritizedFacts.slice(0, maximumFactsBeforePeb), ...(peb ? [peb] : [])];
  });

  private formatFloor(floor: number, floorCount: number): string {
    if (floor > 0) {
      return `${floor}ᵉ`;
    }

    return String(floorCount);
  }

  private buildPrioritizedFacts(property: BienDetailResponseDto): SummaryFact[] {
    const characteristics = property.caracteristiques;
    const equipment = property.equipements;
    const livingArea = this.areaFact(
      'propertyDetail.summary.facts.livingArea',
      'icons/property-detail/area.svg',
      characteristics.surfaceHabitable,
    );
    const bedrooms = this.countFact(
      'propertyDetail.summary.facts.bedrooms',
      'icons/property-detail/bedrooms.svg',
      characteristics.nombreChambres,
    );
    const bathrooms = this.countFact(
      'propertyDetail.summary.facts.bathrooms',
      'icons/property-detail/bathroom.svg',
      characteristics.nombreSallesDeBain,
    );
    const floor = characteristics.etage > 0 || characteristics.nombreEtages > 0
      ? {
          labelKey: 'propertyDetail.summary.facts.floor',
          icon: 'icons/property-detail/floor.svg',
          value: this.formatFloor(characteristics.etage, characteristics.nombreEtages),
        }
      : null;
    const terrace = this.areaFact(
      'propertyDetail.summary.facts.terrace',
      'icons/property-detail/terrace.svg',
      characteristics.surfaceTerrasse,
    );

    if (this.isApartmentType(property.typeBien)) {
      return this.existingFacts(
        livingArea,
        bedrooms,
        bathrooms,
        floor,
        terrace,
        this.booleanAdvantage(
          'propertyDetail.characteristics.equipment.balcony',
          'icons/property-detail/balcony.svg',
          equipment.balcon,
        ),
        this.booleanAdvantage(
          'propertyDetail.summary.facts.elevator',
          'icons/property-detail/elevator.svg',
          equipment.ascenseur,
        ),
        this.booleanAdvantage(
          'propertyDetail.characteristics.equipment.parking',
          'icons/property-detail/parking.svg',
          equipment.parking,
        ),
        this.booleanAdvantage(
          'propertyDetail.characteristics.equipment.garage',
          'icons/property-detail/garage.svg',
          equipment.garage,
        ),
      );
    }

    if (this.isLandType(property.typeBien)) {
      return this.existingFacts(
        this.areaFact(
          'propertyDetail.summary.facts.landArea',
          'icons/property-detail/land.svg',
          characteristics.surfaceTerrain,
        ),
      );
    }

    if (this.isCommercialType(property.typeBien)) {
      return this.existingFacts(
        this.areaFact(
          'propertyDetail.summary.facts.usableArea',
          'icons/property-detail/area.svg',
          characteristics.surfaceHabitable,
        ),
        floor,
        this.booleanAdvantage(
          'propertyDetail.characteristics.equipment.parking',
          'icons/property-detail/parking.svg',
          equipment.parking,
        ),
        this.booleanAdvantage(
          'propertyDetail.summary.facts.elevator',
          'icons/property-detail/elevator.svg',
          equipment.ascenseur,
        ),
      );
    }

    return this.existingFacts(
      livingArea,
      bedrooms,
      this.areaFact(
        'propertyDetail.summary.facts.landArea',
        'icons/property-detail/land.svg',
        characteristics.surfaceTerrain,
      ),
      bathrooms,
      this.booleanAdvantage(
        'propertyDetail.characteristics.equipment.pool',
        'icons/property-detail/pool.svg',
        equipment.piscine,
      ),
      terrace,
      this.areaFact(
        'propertyDetail.characteristics.labels.gardenArea',
        'icons/property-detail/outdoor.svg',
        characteristics.surfaceJardin,
      ),
      this.booleanAdvantage(
        'propertyDetail.characteristics.equipment.garage',
        'icons/property-detail/garage.svg',
        equipment.garage,
      ),
      this.booleanAdvantage(
        'propertyDetail.characteristics.equipment.parking',
        'icons/property-detail/parking.svg',
        equipment.parking,
      ),
      this.booleanAdvantage(
        'propertyDetail.characteristics.equipment.fireplace',
        'icons/property-detail/fireplace.svg',
        equipment.cheminee,
      ),
      floor,
    );
  }

  private areaFact(labelKey: string, icon: string, area: number): SummaryFact | null {
    return area > 0
      ? {
          labelKey,
          icon,
          valueKey: 'propertyDetail.values.area',
          valueParams: { value: area },
        }
      : null;
  }

  private countFact(labelKey: string, icon: string, count: number): SummaryFact | null {
    return count > 0 ? { labelKey, icon, value: String(count) } : null;
  }

  private booleanAdvantage(
    labelKey: string,
    icon: string,
    exists: boolean,
  ): SummaryFact | null {
    return exists
      ? { labelKey, icon, valueKey: 'propertyDetail.values.yes' }
      : null;
  }

  private existingFacts(...facts: Array<SummaryFact | null>): SummaryFact[] {
    return facts.filter((fact): fact is SummaryFact => fact !== null);
  }

  private buildPebFact(property: BienDetailResponseDto): SummaryFact | null {
    const peb = property.peb.trim();

    if (!peb) {
      return null;
    }

    const consumption = property.caracteristiques.consommationEnergie;
    return {
      labelKey: 'propertyDetail.summary.facts.peb',
      pebRating: peb,
      ...(consumption > 0
        ? {
            valueKey: 'propertyDetail.values.energyConsumption',
            valueParams: { value: consumption },
          }
        : {}),
    };
  }

  private isApartmentType(propertyType: string): boolean {
    const normalizedType = propertyType.trim().toLocaleLowerCase();
    return normalizedType === 'appartement' || normalizedType === 'studio';
  }

  private isLandType(propertyType: string): boolean {
    return propertyType.trim().toLocaleLowerCase() === 'terrain';
  }

  private isCommercialType(propertyType: string): boolean {
    return propertyType.trim().toLocaleLowerCase().includes('commerce');
  }
}
