import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-property-agent',
  imports: [TranslatePipe],
  templateUrl: './property-agent.component.html',
  styleUrl: './property-agent.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PropertyAgentComponent {}
