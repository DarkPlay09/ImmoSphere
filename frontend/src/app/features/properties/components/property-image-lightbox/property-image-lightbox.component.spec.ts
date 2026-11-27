import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideTranslateService } from '@ngx-translate/core';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ImageBienResponseDto } from '../../data-access/property-detail-response.model';
import { PropertyImageLightboxComponent } from './property-image-lightbox.component';

describe('PropertyImageLightboxComponent', () => {
  let fixture: ComponentFixture<PropertyImageLightboxComponent>;
  let component: PropertyImageLightboxComponent;

  const images: readonly ImageBienResponseDto[] = [
    { url: '/images/one.jpg', ordre: 1, texteAlternatif: 'Première image' },
    { url: '/images/two.jpg', ordre: 2, texteAlternatif: 'Deuxième image' },
    { url: '/images/three.jpg', ordre: 3, texteAlternatif: 'Troisième image' },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PropertyImageLightboxComponent],
      providers: [provideTranslateService({ lang: 'fr' })],
    }).compileComponents();

    fixture = TestBed.createComponent(PropertyImageLightboxComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('images', images);
    fixture.componentRef.setInput('initialIndex', 1);
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('ouvre l’image correspondant à l’index demandé', () => {
    expect(component.currentImage()).toEqual(images[1]);
  });

  it('navigue vers les images suivante et précédente', () => {
    component.nextImage();
    expect(component.currentImage()).toEqual(images[2]);

    component.previousImage();
    expect(component.currentImage()).toEqual(images[1]);
  });

  it('boucle entre la première et la dernière image', () => {
    component.currentIndex.set(0);
    component.previousImage();
    expect(component.currentImage()).toEqual(images[2]);

    component.nextImage();
    expect(component.currentImage()).toEqual(images[0]);
  });

  it('demande la fermeture de la lightbox', () => {
    const close = vi.spyOn(component.closed, 'emit');

    component.close();

    expect(close).toHaveBeenCalledOnce();
  });
});
