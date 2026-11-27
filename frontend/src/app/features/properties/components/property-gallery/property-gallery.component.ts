import { ChangeDetectionStrategy, Component, computed, input, signal } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

import { ImageBienResponseDto } from '../../data-access/property-detail-response.model';
import { PropertyImageLightboxComponent } from '../property-image-lightbox/property-image-lightbox.component';

@Component({
  selector: 'app-property-gallery',
  imports: [TranslatePipe, PropertyImageLightboxComponent],
  templateUrl: './property-gallery.component.html',
  styleUrl: './property-gallery.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PropertyGalleryComponent {
  readonly images = input.required<readonly ImageBienResponseDto[]>();
  readonly favorite = signal(false);
  readonly selectedImageIndex = signal<number | null>(null);

  readonly orderedImages = computed(() =>
    [...this.images()].sort((first, second) => first.ordre - second.ordre),
  );

  readonly displayedImages = computed(() => this.orderedImages().slice(0, 5));

  toggleFavorite(): void {
    this.favorite.update((favorite) => !favorite);
  }

  openImage(index: number): void {
    this.selectedImageIndex.set(index);
  }

  closeLightbox(): void {
    this.selectedImageIndex.set(null);
  }

  async share(): Promise<void> {
    if (navigator.share) {
      await navigator.share({ url: window.location.href });
      return;
    }

    await navigator.clipboard.writeText(window.location.href);
  }
}
