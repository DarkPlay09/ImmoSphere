import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-property-appointment-card',
  imports: [TranslatePipe],
  templateUrl: './property-appointment-card.component.html',
  styleUrl: './property-appointment-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PropertyAppointmentCardComponent {}
