import { TestBed } from '@angular/core/testing';
import { provideTranslateService } from '@ngx-translate/core';

import { AgencesProBannerComponent } from './agences-pro-banner.component';

describe('AgencesProBannerComponent', () => {
  it('affiche un bouton inactif mais atteignable au clavier', async () => {
    await TestBed.configureTestingModule({
      imports: [AgencesProBannerComponent],
      providers: [provideTranslateService()],
    }).compileComponents();

    const fixture = TestBed.createComponent(AgencesProBannerComponent);
    fixture.detectChanges();

    const button = (fixture.nativeElement as HTMLElement).querySelector<HTMLButtonElement>('.pro-banner__button')!;
    expect(button.tagName).toBe('BUTTON');
    expect(button.type).toBe('button');
    expect(button.disabled).toBe(false);
    expect(button.tabIndex).toBe(0);
    expect(button.getAttribute('aria-disabled')).toBe('true');
    expect(button.getAttribute('title')).toBe('agences.cta.unavailable');
  });
});
