import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

import { BienDetailResponseDto } from '../../data-access/property-detail-response.model';

interface CharacteristicItem {
  readonly labelKey: string;
  readonly value?: string;
  readonly valueKey?: string;
  readonly valueParams?: Readonly<Record<string, string | number>>;
}

interface CharacteristicGroup {
  readonly titleKey: string;
  readonly icon: string;
  readonly items: readonly CharacteristicItem[];
}

@Component({
  selector: 'app-property-characteristics',
  imports: [TranslatePipe],
  templateUrl: './property-characteristics.component.html',
  styleUrl: './property-characteristics.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PropertyCharacteristicsComponent {
  readonly property = input.required<BienDetailResponseDto>();

  readonly groups = computed<readonly CharacteristicGroup[]>(() => {
    const property = this.property();
    const characteristics = property.caracteristiques;
    const equipment = property.equipements;

    return [
      {
        titleKey: 'propertyDetail.characteristics.groups.general',
        icon: 'icons/property-detail/general.svg',
        items: this.present([
          this.area(
            'propertyDetail.characteristics.labels.livingArea',
            characteristics.surfaceHabitable,
          ),
          this.number('propertyDetail.characteristics.labels.floor', characteristics.etage),
          this.positiveNumber(
            'propertyDetail.characteristics.labels.constructionYear',
            characteristics.anneeConstruction,
          ),
          this.text('propertyDetail.characteristics.labels.condition', characteristics.etat),
          this.text('propertyDetail.characteristics.labels.saleStatus', characteristics.etatVente),
        ]),
      },
      {
        titleKey: 'propertyDetail.characteristics.groups.rooms',
        icon: 'icons/property-detail/rooms.svg',
        items: this.present([
          this.number(
            'propertyDetail.characteristics.labels.bedrooms',
            characteristics.nombreChambres,
          ),
          this.number(
            'propertyDetail.characteristics.labels.bathrooms',
            characteristics.nombreSallesDeBain,
          ),
          this.number(
            'propertyDetail.characteristics.labels.toilets',
            characteristics.nombreToilettes,
          ),
          this.text(
            'propertyDetail.characteristics.labels.configuration',
            characteristics.typeConfiguration,
          ),
          this.positiveNumber(
            'propertyDetail.characteristics.labels.floorCount',
            characteristics.nombreEtages,
          ),
        ]),
      },
      {
        titleKey: 'propertyDetail.characteristics.groups.outdoor',
        icon: 'icons/property-detail/outdoor.svg',
        items: this.present([
          this.area(
            'propertyDetail.characteristics.labels.terraceArea',
            characteristics.surfaceTerrasse,
          ),
          this.area(
            'propertyDetail.characteristics.labels.gardenArea',
            characteristics.surfaceJardin,
          ),
          this.area(
            'propertyDetail.characteristics.labels.landArea',
            characteristics.surfaceTerrain,
          ),
          this.boolean('propertyDetail.characteristics.equipment.garage', equipment.garage),
          this.boolean('propertyDetail.characteristics.equipment.parking', equipment.parking),
          this.boolean('propertyDetail.characteristics.equipment.balcony', equipment.balcon),
        ]),
      },
      {
        titleKey: 'propertyDetail.characteristics.groups.equipment',
        icon: 'icons/property-detail/equipment.svg',
        items: this.present([
          this.text(
            'propertyDetail.characteristics.labels.heatingType',
            characteristics.typeChauffage,
          ),
          this.positiveNumber(
            'propertyDetail.characteristics.labels.energyConsumption',
            characteristics.consommationEnergie,
            'propertyDetail.values.energyConsumption',
          ),
          this.text('propertyDetail.characteristics.labels.pebNumber', characteristics.numeroPeb),
          this.text('propertyDetail.characteristics.labels.energyClass', property.peb),
          this.boolean('propertyDetail.characteristics.equipment.cellar', equipment.cave),
          this.boolean('propertyDetail.characteristics.equipment.attic', equipment.grenier),
          this.boolean('propertyDetail.characteristics.equipment.pool', equipment.piscine),
          this.boolean('propertyDetail.characteristics.equipment.fireplace', equipment.cheminee),
        ]),
      },
    ].filter((group) => group.items.length > 0);
  });

  private present(items: readonly (CharacteristicItem | null)[]): readonly CharacteristicItem[] {
    return items.filter((item): item is CharacteristicItem => item !== null);
  }

  private text(labelKey: string, value: string | null | undefined): CharacteristicItem | null {
    return value?.trim() ? { labelKey, value } : null;
  }

  private number(labelKey: string, value: number): CharacteristicItem {
    return { labelKey, value: String(value) };
  }

  private positiveNumber(
    labelKey: string,
    value: number,
    valueKey?: string,
  ): CharacteristicItem | null {
    return value > 0
      ? {
          labelKey,
          value: valueKey ? undefined : String(value),
          valueKey,
          valueParams: valueKey ? { value } : undefined,
        }
      : null;
  }

  private area(labelKey: string, value: number): CharacteristicItem | null {
    return this.positiveNumber(labelKey, value, 'propertyDetail.values.area');
  }

  private boolean(labelKey: string, value: boolean): CharacteristicItem | null {
    return value ? { labelKey, valueKey: 'propertyDetail.values.yes' } : null;
  }
}
