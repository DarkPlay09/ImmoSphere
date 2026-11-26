import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-property-loan-simulation',
  imports: [TranslatePipe],
  templateUrl: './property-loan-simulation.component.html',
  styleUrl: './property-loan-simulation.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PropertyLoanSimulationComponent {}
