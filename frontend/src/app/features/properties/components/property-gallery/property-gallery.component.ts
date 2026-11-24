import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

import { ImageBienResponseDto } from '../../data-access/property-detail-response.model';

@Component({
  selector: 'app-property-gallery',
  imports: [TranslatePipe],
  templateUrl: './property-gallery.component.html',
  styleUrl: './property-gallery.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PropertyGalleryComponent {
  readonly images = input.required<readonly ImageBienResponseDto[]>();

  readonly orderedImages = computed(() =>
    [...this.images()].sort((first, second) => first.ordre - second.ordre),
  );
}
