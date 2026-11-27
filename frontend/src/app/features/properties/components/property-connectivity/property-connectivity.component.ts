import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-property-connectivity',
  imports: [TranslatePipe],
  templateUrl: './property-connectivity.component.html',
  styleUrl: './property-connectivity.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PropertyConnectivityComponent {}
