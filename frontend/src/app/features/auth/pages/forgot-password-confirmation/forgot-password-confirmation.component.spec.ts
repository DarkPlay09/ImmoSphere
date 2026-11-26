import { Location } from '@angular/common';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideTranslateService } from '@ngx-translate/core';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ForgotPasswordConfirmationComponent } from './forgot-password-confirmation.component';

describe('ForgotPasswordConfirmationComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ForgotPasswordConfirmationComponent],
      providers: [
        provideRouter([]),
        provideTranslateService({
          lang: 'fr',
          fallbackLang: 'fr',
        }),
      ],
    }).compileComponents();
  });

  function createComponent(state: unknown) {
    const location = TestBed.inject(Location);

    vi.spyOn(location, 'getState').mockReturnValue(state);

    const fixture = TestBed.createComponent(ForgotPasswordConfirmationComponent);

    fixture.detectChanges();

    return fixture;
  }

  it('récupère l’adresse e-mail transmise', () => {
    const fixture = createComponent({
      email: 'test@example.be',
    });

    expect(fixture.componentInstance.email).toBe('test@example.be');
  });

  it('affiche l’adresse e-mail dans la page', () => {
    const fixture = createComponent({
      email: 'test@example.be',
    });

    expect(fixture.nativeElement.textContent).toContain('test@example.be');
  });

  it('gère un accès direct sans adresse e-mail', () => {
    const fixture = createComponent({});

    expect(fixture.componentInstance.email).toBe('');

    expect(fixture.nativeElement.querySelector('.password-confirmation__email')).toBeNull();
  });

  it('ignore une adresse qui n’est pas une chaîne', () => {
    const fixture = createComponent({
      email: 123,
    });

    expect(fixture.componentInstance.email).toBe('');
  });

  it('désactive le renvoi en attendant le backend', () => {
    const fixture = createComponent({
      email: 'test@example.be',
    });

    const button: HTMLButtonElement = fixture.nativeElement.querySelector(
      '.password-confirmation__secondary',
    );

    expect(button.disabled).toBe(true);
  });
});
