import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  OnDestroy,
  OnInit,
  afterNextRender,
  computed,
  inject,
  input,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';

import { ImageBienResponseDto } from '../../data-access/property-detail-response.model';

@Component({
  selector: 'app-property-image-lightbox',
  imports: [TranslatePipe],
  templateUrl: './property-image-lightbox.component.html',
  styleUrl: './property-image-lightbox.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PropertyImageLightboxComponent implements OnInit, OnDestroy {
  private readonly document = inject(DOCUMENT);
  private readonly closeButton = viewChild<ElementRef<HTMLButtonElement>>('closeButton');
  private previousBodyOverflow = '';

  readonly images = input.required<readonly ImageBienResponseDto[]>();
  readonly initialIndex = input(0);
  readonly closed = output<void>();

  readonly currentIndex = signal(0);
  readonly currentImage = computed(() => this.images()[this.currentIndex()] ?? null);

  constructor() {
    afterNextRender(() => {
      this.previousBodyOverflow = this.document.body.style.overflow;
      this.document.body.style.overflow = 'hidden';
      this.closeButton()?.nativeElement.focus();
    });
  }

  ngOnInit(): void {
    const lastIndex = Math.max(0, this.images().length - 1);
    this.currentIndex.set(Math.min(Math.max(this.initialIndex(), 0), lastIndex));
  }

  previousImage(): void {
    const imageCount = this.images().length;

    if (imageCount > 1) {
      this.currentIndex.update((index) => (index - 1 + imageCount) % imageCount);
    }
  }

  nextImage(): void {
    const imageCount = this.images().length;

    if (imageCount > 1) {
      this.currentIndex.update((index) => (index + 1) % imageCount);
    }
  }

  close(): void {
    this.closed.emit();
  }

  closeFromBackdrop(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.close();
    }
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyboard(event: KeyboardEvent): void {
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      this.previousImage();
    } else if (event.key === 'ArrowRight') {
      event.preventDefault();
      this.nextImage();
    } else if (event.key === 'Escape') {
      event.preventDefault();
      this.close();
    }
  }

  ngOnDestroy(): void {
    this.document.body.style.overflow = this.previousBodyOverflow;
  }
}
