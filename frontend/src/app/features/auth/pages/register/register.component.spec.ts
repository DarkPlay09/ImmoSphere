import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideTranslateService } from '@ngx-translate/core';

import { RegisterComponent } from './register.component';
import type { RegistrationFormValue } from './register.component';

describe('RegisterComponent', () => {
  let component: RegisterComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterComponent],
      providers: [
        provideRouter([]),
        provideTranslateService({ lang: 'fr', fallbackLang: 'fr' }),
      ],
    }).compileComponents();

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

  it('refuse un formulaire vide', () => {
    const requests: RegistrationFormValue[] = [];
    component.registerRequested.subscribe((value) => requests.push(value));

    component.submit();

    expect(component.form.invalid).toBe(true);
    expect(component.attemptedSubmit()).toBe(true);
    expect(requests).toHaveLength(0);
  });

  it('refuse deux mots de passe differents', () => {
    fillValidForm();
    component.form.controls.confirmPassword.setValue('UnAutreMdp123');
    const requests: RegistrationFormValue[] = [];
    component.registerRequested.subscribe((value) => requests.push(value));

    component.submit();

    expect(component.form.hasError('passwordMismatch')).toBe(true);
    expect(requests).toHaveLength(0);
  });

  it('refuse un mot de passe sans minuscule', () => {
    fillValidForm();
    component.form.controls.password.setValue('PASSWORD123');
    component.form.controls.confirmPassword.setValue('PASSWORD123');

    expect(component.form.controls.password.invalid).toBe(true);
  });

  it('emet le formulaire valide sans creer de compte', () => {
    fillValidForm();
    const requests: RegistrationFormValue[] = [];
    component.registerRequested.subscribe((value) => requests.push(value));

    component.submit();

    expect(requests).toEqual([
      {
        givenName: 'Marc',
        name: 'Lambert',
        email: 'marc@example.be',
        password: 'Validpass123',
        accountType: 'utilisateur',
        conditions: true,
      },
    ]);
    expect(component.isLocallyValid()).toBe(true);
  });

  it('emet le type professionnel lorsque selectionne', () => {
    fillValidForm();
    component.setAccountType('professionnel');
    component.form.controls.professionalRole.setValue('agent');
    const requests: RegistrationFormValue[] = [];
    component.registerRequested.subscribe((value) => requests.push(value));

    component.submit();

    expect(requests[0].accountType).toBe('agent');
  });

  it('masque la validation locale apres modification du formulaire', () => {
    fillValidForm();
    component.submit();
    expect(component.isLocallyValid()).toBe(true);

    component.form.controls.email.setValue('nouveau@example.be');

    expect(component.isLocallyValid()).toBe(false);
  });
});
