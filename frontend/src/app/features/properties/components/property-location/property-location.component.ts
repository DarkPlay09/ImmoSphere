import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-property-location',
  imports: [TranslatePipe],
  templateUrl: './property-location.component.html',
  styleUrl: './property-location.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PropertyLocationComponent {}
