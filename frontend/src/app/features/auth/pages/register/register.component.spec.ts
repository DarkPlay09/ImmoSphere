import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { provideTranslateService } from '@ngx-translate/core';
import { of, Subject, throwError } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { RegisterComponent } from './register.component';
import { AuthApiService } from '../../data-access/auth-api.service';

describe('RegisterComponent', () => {
  let component: RegisterComponent;

  const apiMock = {
    postRegisterForm: vi.fn(),
  };

  beforeEach(async () => {
    vi.resetAllMocks();

    apiMock.postRegisterForm.mockReturnValue(of(undefined));

    await TestBed.configureTestingModule({
      imports: [RegisterComponent],
      providers: [
        provideRouter([]),
        provideTranslateService({
          lang: 'fr',
          fallbackLang: 'fr',
        }),
        {
          provide: AuthApiService,
          useValue: apiMock,
        },
      ],
    }).compileComponents();

    vi.spyOn(TestBed.inject(Router), 'navigate').mockResolvedValue(true);

    const fixture = TestBed.createComponent(RegisterComponent);

    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  function fillValidForm(): void {
    component.form.patchValue({
      givenName: ' Marc ',
      name: ' Lambert ',
      email: 'marc@example.be',
      password: 'Validpass123',
      confirmPassword: 'Validpass123',
      conditions: true,
    });
  }

  it('crée le composant', () => {
    expect(component).toBeTruthy();
  });

  it('refuse un formulaire vide', () => {
    component.submit();

    expect(component.form.invalid).toBe(true);
    expect(component.attemptedSubmit()).toBe(true);

    expect(apiMock.postRegisterForm).not.toHaveBeenCalled();
  });

  it('refuse deux mots de passe différents', () => {
    fillValidForm();

    component.form.controls.confirmPassword.setValue('UnAutreMdp123');

    component.submit();

    expect(component.form.hasError('passwordMismatch')).toBe(true);

    expect(apiMock.postRegisterForm).not.toHaveBeenCalled();
  });

  it('refuse un mot de passe sans minuscule', () => {
    fillValidForm();

    component.form.controls.password.setValue('PASSWORD123');
    component.form.controls.confirmPassword.setValue('PASSWORD123');

    expect(component.form.controls.password.invalid).toBe(true);
  });

  it('refuse un formulaire sans acceptation des conditions', () => {
    fillValidForm();

    component.form.controls.conditions.setValue(false);

    component.submit();

    expect(component.form.invalid).toBe(true);

    expect(apiMock.postRegisterForm).not.toHaveBeenCalled();
  });

  it('transmet le formulaire valide à l’API', () => {
    fillValidForm();

    component.submit();

    expect(apiMock.postRegisterForm).toHaveBeenCalledWith({
      givenName: 'Marc',
      name: 'Lambert',
      email: 'marc@example.be',
      password: 'Validpass123',
      accountType: 'utilisateur',
      conditions: true,
    });

    expect(component.registrationStatus()).toBe('success');
  });

  it.each(['agent', 'notaire'] as const)('transmet le rôle professionnel %s', (role) => {
    fillValidForm();

    component.setAccountType('professionnel');
    component.form.controls.professionalRole.setValue(role);

    component.submit();

    expect(apiMock.postRegisterForm).toHaveBeenCalledWith(
      expect.objectContaining({
        accountType: role,
      }),
    );
  });

  it('refuse un professionnel sans rôle sélectionné', () => {
    fillValidForm();

    component.setAccountType('professionnel');

    component.submit();

    expect(component.form.invalid).toBe(true);

    expect(apiMock.postRegisterForm).not.toHaveBeenCalled();
  });

  it('redirige vers la vérification de l’adresse e-mail', () => {
    fillValidForm();

    component.submit();

    expect(TestBed.inject(Router).navigate).toHaveBeenCalledWith(['/verify-email'], {
      state: {
        email: 'marc@example.be',
      },
    });
  });

  it('gère une erreur retournée par l’API', () => {
    apiMock.postRegisterForm.mockReturnValue(throwError(() => new Error('Erreur API')));

    fillValidForm();

    component.submit();

    expect(component.registrationStatus()).toBe('error');

    expect(TestBed.inject(Router).navigate).not.toHaveBeenCalled();
  });

  it('réinitialise le statut après modification du formulaire', () => {
    fillValidForm();

    component.submit();

    expect(component.registrationStatus()).toBe('success');

    component.form.controls.email.setValue('nouveau@example.be');

    expect(component.registrationStatus()).toBe('idle');
  });

  it('empêche plusieurs inscriptions simultanées', () => {
    const response = new Subject<void>();

    apiMock.postRegisterForm.mockReturnValue(response);

    fillValidForm();

    component.submit();
    component.submit();

    expect(component.registrationStatus()).toBe('loading');

    expect(apiMock.postRegisterForm).toHaveBeenCalledTimes(1);

    response.next(undefined);
    response.complete();

    expect(component.registrationStatus()).toBe('success');
  });
});
