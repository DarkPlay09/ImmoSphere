import {
  ChangeDetectionStrategy,
  Component,
  input
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-publish-property-cta',
  standalone: true,
  imports: [RouterLink, TranslatePipe],
  templateUrl: './publish-property-cta.component.html',
  styleUrl: './publish-property-cta.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PublishPropertyCtaComponent {
  readonly publishRoute = input<string | null>(null);

  readonly benefits = [
    'home.publish.benefit1',
    'home.publish.benefit2',
    'home.publish.benefit3'
  ] as const;
}
