import { ChangeDetectionStrategy, Component, computed, input, signal } from '@angular/core';
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
  readonly favorite = signal(false);

  readonly orderedImages = computed(() =>
    [...this.images()].sort((first, second) => first.ordre - second.ordre),
  );

  toggleFavorite(): void {
    this.favorite.update((favorite) => !favorite);
  }

  async share(): Promise<void> {
    if (navigator.share) {
      await navigator.share({ url: window.location.href });
      return;
    }

    await navigator.clipboard.writeText(window.location.href);
  }
}
