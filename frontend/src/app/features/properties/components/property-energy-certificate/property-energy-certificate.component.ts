import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

import { PebBadgeComponent } from '../../../../shared/properties/components/peb-badge/peb-badge.component';
import { PebRating, parsePebRating } from '../../../../shared/properties/models/peb-rating.model';
import { BienDetailResponseDto } from '../../data-access/property-detail-response.model';

interface EnergyScaleStep {
  readonly label: string;
  readonly range: string;
  readonly color: string;
  readonly rating: PebRating;
}

@Component({
  selector: 'app-property-energy-certificate',
  imports: [PebBadgeComponent, TranslatePipe],
  templateUrl: './property-energy-certificate.component.html',
  styleUrl: './property-energy-certificate.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PropertyEnergyCertificateComponent {
  readonly property = input.required<BienDetailResponseDto>();

  readonly scale: readonly EnergyScaleStep[] = [
    { label: 'A++', range: '≤ 0', color: '#006b2e', rating: 'A++' },
    { label: 'A+', range: '0–45', color: '#00823b', rating: 'A+' },
    { label: 'A', range: '45–85', color: '#059669', rating: 'A' },
    { label: 'B', range: '85–170', color: '#65a30d', rating: 'B' },
    { label: 'C', range: '170–255', color: '#a3b800', rating: 'C' },
    { label: 'D', range: '255–340', color: '#eab308', rating: 'D' },
    { label: 'E', range: '340–425', color: '#f97316', rating: 'E' },
    { label: 'F', range: '425–510', color: '#dc2626', rating: 'F' },
    { label: 'G', range: '> 510', color: '#991b1b', rating: 'G' },
  ];

  readonly certificateNumber = computed(() =>
    this.property().caracteristiques.numeroPeb.trim(),
  );

  readonly consumption = computed(() =>
    this.property().caracteristiques.consommationEnergie,
  );

  readonly rating = computed(() => parsePebRating(this.property().peb));

  isActive(rating: PebRating): boolean {
    return this.rating() === rating;
  }
}
