import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { provideTranslateService } from '@ngx-translate/core';
import { beforeEach, describe, expect, it } from 'vitest';

import { ResetPasswordComponent } from './reset-password.component';

describe('ResetPasswordComponent', () => {
  let harness: RouterTestingHarness;
  let component: ResetPasswordComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        provideRouter([
          {
            path: 'reset-password',
            component: ResetPasswordComponent,
          },
        ]),
        provideTranslateService({
          lang: 'fr',
          fallbackLang: 'fr',
        }),
      ],
    }).compileComponents();

    harness = await RouterTestingHarness.create();

    component = await harness.navigateByUrl(
      '/reset-password?email=test%40example.be&token=test-token',
      ResetPasswordComponent,
    );
  });

  function fillPasswords(password: string, confirmation = password): void {
    component.form.setValue({
      password,
      confirmPassword: confirmation,
    });
  }

  it('détecte la présence des paramètres du lien', () => {
    expect(component.hasResetLink()).toBe(true);
  });

  it('refuse un formulaire vide', () => {
    component.submit();

    expect(component.form.invalid).toBe(true);
    expect(component.integrationNoticeVisible()).toBe(false);
  });

  it.each(['Abc123', 'password123', 'PASSWORD123', 'PasswordSansChiffre'])(
    'refuse le mot de passe invalide %s',
    (password) => {
      fillPasswords(password);

      expect(component.form.controls.password.invalid).toBe(true);
    },
  );

  it('accepte un mot de passe respectant les critères', () => {
    fillPasswords('ValidPassword123');

    expect(component.form.valid).toBe(true);

    expect(component.passwordRules).toEqual({
      minLength: true,
      upper: true,
      lower: true,
      digit: true,
    });
  });

  it('refuse deux mots de passe différents', () => {
    fillPasswords('ValidPassword123', 'AutrePassword456');

    component.submit();

    expect(component.form.hasError('passwordMismatch')).toBe(true);

    expect(component.showPasswordMismatch()).toBe(true);
    expect(component.integrationNoticeVisible()).toBe(false);
  });

  it('gère indépendamment la visibilité des deux champs', () => {
    component.togglePasswordVisibility();

    expect(component.isPasswordVisible()).toBe(true);
    expect(component.isConfirmationVisible()).toBe(false);

    component.toggleConfirmationVisibility();

    expect(component.isConfirmationVisible()).toBe(true);

    component.togglePasswordVisibility();

    expect(component.isPasswordVisible()).toBe(false);
    expect(component.isConfirmationVisible()).toBe(true);
  });

  it('affiche le message temporaire après validation', () => {
    fillPasswords('ValidPassword123');
    component.submit();

    expect(component.integrationNoticeVisible()).toBe(true);
  });

  it('masque le message après modification du formulaire', () => {
    fillPasswords('ValidPassword123');
    component.submit();

    component.form.controls.password.setValue('AutrePassword456');

    expect(component.integrationNoticeVisible()).toBe(false);
  });

  it('refuse un lien sans token', async () => {
    component = await harness.navigateByUrl(
      '/reset-password?email=test%40example.be',
      ResetPasswordComponent,
    );

    expect(component.hasResetLink()).toBe(false);

    fillPasswords('ValidPassword123');
    component.submit();

    expect(component.integrationNoticeVisible()).toBe(false);
  });

  it('refuse un lien sans adresse e-mail', async () => {
    component = await harness.navigateByUrl(
      '/reset-password?token=test-token',
      ResetPasswordComponent,
    );

    expect(component.hasResetLink()).toBe(false);
  });
});
