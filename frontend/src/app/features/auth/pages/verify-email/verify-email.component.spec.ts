import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideTranslateService } from '@ngx-translate/core';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { AuthShellComponent } from '../../components/auth-shell/auth-shell.component';
import { VerifyEmailComponent } from './verify-email.component';

@Component({ selector: 'app-auth-shell', standalone: true, template: '<ng-content />' })
class AuthShellStubComponent {}

describe('VerifyEmailComponent', () => {
  let fixture: ComponentFixture<VerifyEmailComponent>;
  let component: VerifyEmailComponent;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [VerifyEmailComponent],
      providers: [
        provideRouter([]),
        provideTranslateService({ lang: 'fr', fallbackLang: 'fr' }),
      ],
    });

    TestBed.overrideComponent(VerifyEmailComponent, {
      remove: { imports: [AuthShellComponent] },
      add: { imports: [AuthShellStubComponent] },
    });

    await TestBed.compileComponents();
    fixture = TestBed.createComponent(VerifyEmailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('refuse un code incomplet sans déclencher de vérification', () => {
    const listener = vi.fn();
    component.verifyRequested.subscribe(listener);

    component.onDigitInput({ target: { value: '1' } } as unknown as Event, 0);
    component.submit();

    expect(component.codeIncomplete()).toBe(true);
    expect(listener).not.toHaveBeenCalled();
  });

  it('accepte le collage d’un code entier et ne conserve que les chiffres', () => {
    const preventDefault = vi.fn();
    component.onDigitPaste({
      preventDefault,
      clipboardData: { getData: () => '12 34-56' },
    } as unknown as ClipboardEvent, 0);

    expect(preventDefault).toHaveBeenCalled();
    expect(component.code()).toBe('123456');
    expect(component.digits()).toEqual(['1', '2', '3', '4', '5', '6']);
  });

  it('émet uniquement les six chiffres, sans appeler de service HTTP', () => {
    const listener = vi.fn();
    component.verifyRequested.subscribe(listener);
    component.onDigitInput({ target: { value: '123456' } } as unknown as Event, 0);

    component.submit();

    expect(listener).toHaveBeenCalledTimes(1);
    expect(listener).toHaveBeenCalledWith('123456');
    expect(component.previewNoticeVisible()).toBe(true);
  });

  it('ne permet le renvoi que lorsque le backend l’autorise', () => {
    const listener = vi.fn();
    component.resendRequested.subscribe(listener);

    component.resend();
    expect(listener).not.toHaveBeenCalled();

    fixture.componentRef.setInput('canResend', true);
    fixture.detectChanges();
    component.resend();
    expect(listener).toHaveBeenCalledTimes(1);
  });
});
