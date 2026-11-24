import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

import { BienDetailResponseDto } from '../../data-access/property-detail-response.model';

interface CharacteristicItem {
  readonly label: string;
  readonly value: string;
}

interface CharacteristicGroup {
  readonly title: string;
  readonly items: readonly CharacteristicItem[];
}

@Component({
  selector: 'app-property-characteristics',
  imports: [],
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
        title: 'Général',
        items: this.present([
          this.positiveNumber('Année de construction', characteristics.anneeConstruction),
          this.text('État du bien', characteristics.etat),
          this.text('État de la vente', characteristics.etatVente),
          this.text('Configuration', characteristics.typeConfiguration),
          this.positiveNumber('Nombre d’étages', characteristics.nombreEtages),
        ]),
      },
      {
        title: 'Surfaces',
        items: this.present([
          this.area('Surface habitable', characteristics.surfaceHabitable),
          this.area('Surface du terrain', characteristics.surfaceTerrain),
          this.area('Surface du jardin', characteristics.surfaceJardin),
          this.area('Surface de la terrasse', characteristics.surfaceTerrasse),
        ]),
      },
      {
        title: 'Pièces et sanitaires',
        items: this.present([
          this.number('Chambres', characteristics.nombreChambres),
          this.number('Salles de bain', characteristics.nombreSallesDeBain),
          this.number('Toilettes', characteristics.nombreToilettes),
          this.number('Étage du bien', characteristics.etage),
        ]),
      },
      {
        title: 'Énergie',
        items: this.present([
          this.text('Type de chauffage', characteristics.typeChauffage),
          this.positiveNumber(
            'Consommation énergétique',
            characteristics.consommationEnergie,
            ' kWh/m²/an',
          ),
          this.text('Numéro PEB', characteristics.numeroPeb),
          this.text('Classe énergétique', this.property().peb),
        ]),
      },
    ].filter((group) => group.items.length > 0);
  });

  readonly equipmentLabels = computed<readonly string[]>(() => {
    const equipment = this.property().equipements;

    return [
      equipment.garage ? 'Garage' : null,
      equipment.parking ? 'Parking' : null,
      equipment.jardin ? 'Jardin' : null,
      equipment.balcon ? 'Balcon' : null,
      equipment.cave ? 'Cave' : null,
      equipment.terrasse ? 'Terrasse' : null,
      equipment.grenier ? 'Grenier' : null,
      equipment.ascenseur ? 'Ascenseur' : null,
      equipment.piscine ? 'Piscine' : null,
      equipment.cheminee ? 'Cheminée' : null,
    ].filter((label): label is string => label !== null);
  });

  private present(items: readonly (CharacteristicItem | null)[]): readonly CharacteristicItem[] {
    return items.filter((item): item is CharacteristicItem => item !== null);
  }

  private text(label: string, value: string | null | undefined): CharacteristicItem | null {
    return value?.trim() ? { label, value } : null;
  }

  private number(label: string, value: number): CharacteristicItem {
    return { label, value: String(value) };
  }

  private positiveNumber(label: string, value: number, suffix = ''): CharacteristicItem | null {
    return value > 0 ? { label, value: `${value}${suffix}` } : null;
  }

  private area(label: string, value: number): CharacteristicItem | null {
    return this.positiveNumber(label, value, ' m²');
  }
}
