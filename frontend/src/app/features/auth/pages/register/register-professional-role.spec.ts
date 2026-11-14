import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideTranslateService } from '@ngx-translate/core';

import { RegisterComponent } from './register.component';

describe('RegisterComponent - type professionnel', () => {
  let component: RegisterComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterComponent],
      providers: [provideRouter([]), provideTranslateService({ lang: 'fr' })],
    }).compileComponents();

    component = TestBed.createComponent(RegisterComponent).componentInstance;
  });

  function fillValidForm(): void {
    component.form.patchValue({
      givenName: 'Marc',
      name: 'Lambert',
      email: 'marc.lambert@example.be',
      password: 'Belgique2026!',
      confirmPassword: 'Belgique2026!',
      conditions: true,
    });
  }

  it('ne demande pas de profession pour un particulier', () => {
    fillValidForm();
    expect(component.form.controls.professionalRole.disabled).toBe(true);
    expect(component.form.valid).toBe(true);
  });

  it('exige une profession si Professionnel est sélectionné', () => {
    fillValidForm();
    component.setAccountType('professionnel');

    expect(component.form.controls.professionalRole.enabled).toBe(true);
    expect(component.form.valid).toBe(false);

    component.form.controls.professionalRole.setValue('agent');
    expect(component.form.valid).toBe(true);
  });

  it.each(['agent', 'notaire'] as const)(
    'émet le type de compte %s',
    (role) => {
      fillValidForm();
      component.setAccountType('professionnel');
      component.form.controls.professionalRole.setValue(role);
      const handler = vi.fn();
      const subscription = component.registerRequested.subscribe(handler);

      component.submit();

      expect(handler).toHaveBeenCalledWith(
        expect.objectContaining({ accountType: role }),
      );
      subscription.unsubscribe();
    },
  );

  it('efface le rôle professionnel lorsqu’on revient à Particulier', () => {
    component.setAccountType('professionnel');
    component.form.controls.professionalRole.setValue('notaire');
    component.setAccountType('particulier');

    expect(component.form.controls.professionalRole.value).toBeNull();
    expect(component.form.controls.professionalRole.disabled).toBe(true);
  });

  it('émet utilisateur pour un particulier', () => {
    fillValidForm();
    const handler = vi.fn();
    const subscription = component.registerRequested.subscribe(handler);

    component.submit();

    expect(handler).toHaveBeenCalledWith(
      expect.objectContaining({ accountType: 'utilisateur' }),
    );
    subscription.unsubscribe();
  });
});
