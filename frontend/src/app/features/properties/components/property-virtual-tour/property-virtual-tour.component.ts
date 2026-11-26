import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-property-virtual-tour',
  imports: [TranslatePipe],
  templateUrl: './property-virtual-tour.component.html',
  styleUrl: './property-virtual-tour.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PropertyVirtualTourComponent {}
