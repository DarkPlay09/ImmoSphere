import { TestBed } from '@angular/core/testing';
import { provideTranslateService } from '@ngx-translate/core';

import { FaqContactBannerComponent } from './faq-contact-banner.component';

describe('FaqContactBannerComponent', () => {
  it('affiche un bouton de contact inactif mais atteignable au clavier, sans adresse e-mail', async () => {
    await TestBed.configureTestingModule({
      imports: [FaqContactBannerComponent],
      providers: [provideTranslateService()],
    }).compileComponents();

    const fixture = TestBed.createComponent(FaqContactBannerComponent);
    fixture.detectChanges();

    const element = fixture.nativeElement as HTMLElement;
    const button = element.querySelector<HTMLButtonElement>('.faq-contact__button')!;
    expect(button.type).toBe('button');
    expect(button.disabled).toBe(false);
    expect(button.getAttribute('aria-disabled')).toBe('true');
    expect(button.getAttribute('title')).toBe('faq.contact.unavailable');
    expect(element.querySelector('a[href^="mailto:"]')).toBeNull();
  });
});
