import { computed, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideTranslateService } from '@ngx-translate/core';

import { beforeEach, describe, expect, it, vi } from 'vitest';

import {
  AuthSessionService,
  AuthSessionStatus,
} from '../../../../features/auth/data-access/auth-session.service';

import { PropertyFavoritesStore } from '../../data-access/property-favorites.store';
import { PropertyFavoriteButtonComponent } from './property-favorite-button.component';

describe('PropertyFavoriteButtonComponent', () => {
  let fixture: ComponentFixture<PropertyFavoriteButtonComponent>;
  let component: PropertyFavoriteButtonComponent;

  const sessionStatus = signal<AuthSessionStatus>('authenticated');

  const favoriteStatus = signal<'idle' | 'loading' | 'ready' | 'error'>('ready');

  const favorite = signal(false);
  const pending = signal(false);
  const failed = signal(false);

  const sessionMock = {
    status: sessionStatus,
    isAuthenticated: computed(() => sessionStatus() === 'authenticated'),
    refresh: vi.fn(),
  };

  const storeMock = {
    status: favoriteStatus,
    isLoading: computed(() => favoriteStatus() === 'loading'),
    isFavorite: vi.fn(() => favorite()),
    isPending: vi.fn(() => pending()),
    hasFailed: vi.fn(() => failed()),
    toggleFavorite: vi.fn(),
    retryLoad: vi.fn(),
  };

  function getButton(): HTMLButtonElement {
    return fixture.nativeElement.querySelector('button');
  }

  beforeEach(async () => {
    vi.clearAllMocks();

    sessionStatus.set('authenticated');
    favoriteStatus.set('ready');

    favorite.set(false);
    pending.set(false);
    failed.set(false);

    await TestBed.configureTestingModule({
      imports: [PropertyFavoriteButtonComponent],
      providers: [
        provideTranslateService({
          lang: 'fr',
          fallbackLang: 'fr',
        }),
        {
          provide: AuthSessionService,
          useValue: sessionMock,
        },
        {
          provide: PropertyFavoritesStore,
          useValue: storeMock,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PropertyFavoriteButtonComponent);

    component = fixture.componentInstance;

    fixture.componentRef.setInput('propertyId', 5);
    fixture.detectChanges();
  });

  it('crée le composant', () => {
    expect(component).toBeTruthy();
  });

  it('affiche un cœur non sélectionné par défaut', () => {
    expect(component.isFavorite()).toBe(false);

    expect(getButton().getAttribute('aria-pressed')).toBe('false');
  });

  it('affiche un cœur actif lorsque le bien est favori', () => {
    favorite.set(true);
    fixture.detectChanges();

    expect(component.isFavorite()).toBe(true);

    expect(getButton().classList.contains('favorite-button--active')).toBe(true);

    expect(getButton().getAttribute('aria-pressed')).toBe('true');
  });

  it('demande au store de modifier le favori', () => {
    getButton().click();

    expect(storeMock.toggleFavorite).toHaveBeenCalledWith(5);
  });

  it('demande une connexion pour un visiteur', () => {
    sessionStatus.set('anonymous');

    fixture.detectChanges();

    const emit = vi.spyOn(component.loginRequested, 'emit');

    getButton().click();

    expect(emit).toHaveBeenCalledTimes(1);

    expect(storeMock.toggleFavorite).not.toHaveBeenCalled();
  });

  it('désactive le bouton pendant une modification', () => {
    pending.set(true);

    fixture.detectChanges();

    expect(getButton().disabled).toBe(true);

    getButton().click();

    expect(storeMock.toggleFavorite).not.toHaveBeenCalled();
  });

  it('désactive le bouton pendant le chargement des favoris', () => {
    favoriteStatus.set('loading');

    fixture.detectChanges();

    expect(getButton().disabled).toBe(true);
  });

  it('désactive le bouton pendant la vérification de session', () => {
    sessionStatus.set('loading');

    fixture.detectChanges();

    expect(getButton().disabled).toBe(true);
  });

  it('permet de relancer un chargement ayant échoué', () => {
    favoriteStatus.set('error');

    fixture.detectChanges();

    getButton().click();

    expect(storeMock.retryLoad).toHaveBeenCalledTimes(1);

    expect(storeMock.toggleFavorite).not.toHaveBeenCalled();
  });

  it('permet de relancer la vérification de session', () => {
    sessionStatus.set('error');

    fixture.detectChanges();

    getButton().click();

    expect(sessionMock.refresh).toHaveBeenCalledTimes(1);
  });

  it('signale une erreur de modification', () => {
    failed.set(true);

    fixture.detectChanges();

    expect(getButton().classList.contains('favorite-button--error')).toBe(true);

    expect(fixture.nativeElement.querySelector('[role="alert"]')).not.toBeNull();
  });

  it('applique la petite taille du bouton', () => {
    fixture.componentRef.setInput('size', 'small');

    fixture.detectChanges();

    expect(getButton().classList.contains('favorite-button--small')).toBe(true);
  });

  it('applique la grande taille du bouton', () => {
    fixture.componentRef.setInput('size', 'large');

    fixture.detectChanges();

    expect(getButton().classList.contains('favorite-button--large')).toBe(true);
  });

  it('empêche la propagation du clic vers la carte parente', () => {
    const event = new MouseEvent('click', {
      bubbles: true,
    });

    const stopPropagation = vi.spyOn(event, 'stopPropagation');

    component.toggleFavorite(event);

    expect(stopPropagation).toHaveBeenCalledTimes(1);
  });
});
