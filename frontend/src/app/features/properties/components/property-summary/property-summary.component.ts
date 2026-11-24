import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

import { BienDetailResponseDto } from '../../data-access/property-detail-response.model';

interface SummaryFact {
  readonly label: string;
  readonly value: string;
}

@Component({
  selector: 'app-property-summary',
  imports: [],
  templateUrl: './property-summary.component.html',
  styleUrl: './property-summary.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PropertySummaryComponent {
  readonly property = input.required<BienDetailResponseDto>();

  readonly formattedPrice = computed(() =>
    new Intl.NumberFormat('fr-BE', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0,
    }).format(this.property().prix),
  );

  readonly publicAddress = computed(() => {
    const property = this.property();
    const locality = `${property.codePostal} ${property.localite}`;

    if (property.adresseConfidentielle || !property.rue || property.numero === null) {
      return locality;
    }

    const box = property.boite ? ` boîte ${property.boite}` : '';
    return `${property.rue} ${property.numero}${box}, ${locality}`;
  });

  readonly facts = computed<readonly SummaryFact[]>(() => {
    const characteristics = this.property().caracteristiques;

    return [
      { label: 'Chambres', value: String(characteristics.nombreChambres) },
      { label: 'Salle(s) de bain', value: String(characteristics.nombreSallesDeBain) },
      { label: 'Surface habitable', value: `${characteristics.surfaceHabitable} m²` },
      { label: 'Étage', value: String(characteristics.etage) },
      { label: 'PEB', value: this.property().peb },
      {
        label: 'Consommation',
        value: `${characteristics.consommationEnergie} kWh/m²/an`,
      },
    ];
  });
}
