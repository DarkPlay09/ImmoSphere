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
    const characteristics = this.property().caracteristiques;

    return [
      {
        titleKey: 'propertyDetail.characteristics.groups.general',
        items: this.present([
          this.positiveNumber(
            'propertyDetail.characteristics.labels.constructionYear',
            characteristics.anneeConstruction,
          ),
          this.text('propertyDetail.characteristics.labels.condition', characteristics.etat),
          this.text('propertyDetail.characteristics.labels.saleStatus', characteristics.etatVente),
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
        titleKey: 'propertyDetail.characteristics.groups.areas',
        items: this.present([
          this.area(
            'propertyDetail.characteristics.labels.livingArea',
            characteristics.surfaceHabitable,
          ),
          this.area(
            'propertyDetail.characteristics.labels.landArea',
            characteristics.surfaceTerrain,
          ),
          this.area(
            'propertyDetail.characteristics.labels.gardenArea',
            characteristics.surfaceJardin,
          ),
          this.area(
            'propertyDetail.characteristics.labels.terraceArea',
            characteristics.surfaceTerrasse,
          ),
        ]),
      },
      {
        titleKey: 'propertyDetail.characteristics.groups.rooms',
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
          this.number('propertyDetail.characteristics.labels.floor', characteristics.etage),
        ]),
      },
      {
        titleKey: 'propertyDetail.characteristics.groups.energy',
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
          this.text('propertyDetail.characteristics.labels.energyClass', this.property().peb),
        ]),
      },
    ].filter((group) => group.items.length > 0);
  });

  readonly equipmentLabels = computed<readonly string[]>(() => {
    const equipment = this.property().equipements;

    return [
      equipment.garage ? 'propertyDetail.characteristics.equipment.garage' : null,
      equipment.parking ? 'propertyDetail.characteristics.equipment.parking' : null,
      equipment.jardin ? 'propertyDetail.characteristics.equipment.garden' : null,
      equipment.balcon ? 'propertyDetail.characteristics.equipment.balcony' : null,
      equipment.cave ? 'propertyDetail.characteristics.equipment.cellar' : null,
      equipment.terrasse ? 'propertyDetail.characteristics.equipment.terrace' : null,
      equipment.grenier ? 'propertyDetail.characteristics.equipment.attic' : null,
      equipment.ascenseur ? 'propertyDetail.characteristics.equipment.elevator' : null,
      equipment.piscine ? 'propertyDetail.characteristics.equipment.pool' : null,
      equipment.cheminee ? 'propertyDetail.characteristics.equipment.fireplace' : null,
    ].filter((label): label is string => label !== null);
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
}
