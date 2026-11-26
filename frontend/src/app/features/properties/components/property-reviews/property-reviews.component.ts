import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-property-reviews',
  imports: [TranslatePipe],
  templateUrl: './property-reviews.component.html',
  styleUrl: './property-reviews.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PropertyReviewsComponent {}
