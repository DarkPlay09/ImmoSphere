import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-home-hero',
  standalone: true,
  imports: [TranslatePipe],
  templateUrl: './home-hero.component.html',
  styleUrl: './home-hero.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeHeroComponent {}
