import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { provideTranslateService } from '@ngx-translate/core';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ForgotPasswordComponent } from './forgot-password.component';

describe('ForgotPasswordComponent', () => {
  let fixture: ComponentFixture<ForgotPasswordComponent>;
  let component: ForgotPasswordComponent;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ForgotPasswordComponent],
      providers: [
        provideRouter([]),
        provideTranslateService({
          lang: 'fr',
          fallbackLang: 'fr',
        }),
      ],
    }).compileComponents();

    router = TestBed.inject(Router);

    fixture = TestBed.createComponent(ForgotPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('crée le composant', () => {
    expect(component).toBeTruthy();
  });

  it('refuse une adresse e-mail vide', () => {
    const navigate = vi.spyOn(router, 'navigate');

    component.submit();

    expect(component.form.invalid).toBe(true);
    expect(component.attemptedSubmit()).toBe(true);
    expect(component.showError()).toBe(true);
    expect(navigate).not.toHaveBeenCalled();
  });

  it('refuse une adresse e-mail invalide', () => {
    const navigate = vi.spyOn(router, 'navigate');

    component.form.controls.email.setValue('email-invalide');
    component.submit();

    expect(component.form.invalid).toBe(true);
    expect(navigate).not.toHaveBeenCalled();
  });

  it('supprime les espaces autour de l’adresse e-mail', () => {
    vi.spyOn(router, 'navigate').mockResolvedValue(true);

    component.form.controls.email.setValue(' test@example.be ');
    component.submit();

    expect(component.form.controls.email.value).toBe('test@example.be');
  });

  it('redirige vers la confirmation avec une adresse valide', () => {
    const navigate = vi.spyOn(router, 'navigate').mockResolvedValue(true);

    component.form.controls.email.setValue('test@example.be');
    component.submit();

    expect(component.form.valid).toBe(true);

    expect(navigate).toHaveBeenCalledWith(['/forgot-password/confirmation'], {
      state: {
        email: 'test@example.be',
      },
    });
  });
});
