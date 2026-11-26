import { computed, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { of, Subject, throwError } from 'rxjs';

import { beforeEach, describe, expect, it, vi } from 'vitest';

import {
  AuthenticatedUser,
  AuthSessionService,
} from '../../../features/auth/data-access/auth-session.service';

import { PropertyFavoritesApiService } from './property-favorites-api.service';
import { PropertyFavoritesStore } from './property-favorites.store';

describe('PropertyFavoritesStore', () => {
  let store: PropertyFavoritesStore;

  const user = signal<AuthenticatedUser | null>(null);

  const sessionMock = {
    user,
    isAuthenticated: computed(() => user() !== null),
  };

  const apiMock = {
    getFavorites: vi.fn(),
    addFavorite: vi.fn(),
    removeFavorite: vi.fn(),
  };

  function connect(userId = 'user-1'): void {
    user.set({
      id: userId,
      email: `${userId}@example.be`,
    });

    TestBed.tick();
  }

  function disconnect(): void {
    user.set(null);
    TestBed.tick();
  }

  beforeEach(() => {
    vi.resetAllMocks();

    user.set(null);

    apiMock.getFavorites.mockReturnValue(of([1, 3]));
    apiMock.addFavorite.mockReturnValue(of(undefined));
    apiMock.removeFavorite.mockReturnValue(of(undefined));

    TestBed.configureTestingModule({
      providers: [
        PropertyFavoritesStore,
        {
          provide: PropertyFavoritesApiService,
          useValue: apiMock,
        },
        {
          provide: AuthSessionService,
          useValue: sessionMock,
        },
      ],
    });

    store = TestBed.inject(PropertyFavoritesStore);

    TestBed.tick();
  });

  it('ne charge pas les favoris sans connexion', () => {
    expect(store.favoriteIds()).toEqual([]);
    expect(store.count()).toBe(0);
    expect(apiMock.getFavorites).not.toHaveBeenCalled();
  });

  it('charge les favoris après connexion', () => {
    connect();

    expect(apiMock.getFavorites).toHaveBeenCalledTimes(1);
    expect(store.favoriteIds()).toEqual([1, 3]);
    expect(store.count()).toBe(2);
    expect(store.isReady()).toBe(true);
  });

  it('identifie les biens favoris', () => {
    connect();

    expect(store.isFavorite(1)).toBe(true);
    expect(store.isFavorite(3)).toBe(true);
    expect(store.isFavorite(8)).toBe(false);
  });

  it('ajoute un favori et actualise le compteur', () => {
    connect();

    store.toggleFavorite(5);

    expect(apiMock.addFavorite).toHaveBeenCalledWith(5);
    expect(store.isFavorite(5)).toBe(true);
    expect(store.count()).toBe(3);
  });

  it('retire un favori et actualise le compteur', () => {
    connect();

    store.toggleFavorite(1);

    expect(apiMock.removeFavorite).toHaveBeenCalledWith(1);
    expect(store.isFavorite(1)).toBe(false);
    expect(store.count()).toBe(1);
  });

  it('refuse une modification sans connexion', () => {
    store.toggleFavorite(5);

    expect(apiMock.addFavorite).not.toHaveBeenCalled();
    expect(apiMock.removeFavorite).not.toHaveBeenCalled();
  });

  it.each([0, -1, 1.5, NaN])('refuse un identifiant invalide : %s', (propertyId) => {
    connect();

    store.toggleFavorite(propertyId);

    expect(apiMock.addFavorite).not.toHaveBeenCalled();
    expect(apiMock.removeFavorite).not.toHaveBeenCalled();
  });

  it('attend la confirmation du backend avant de modifier le favori', () => {
    const response = new Subject<void>();

    apiMock.addFavorite.mockReturnValue(response);

    connect();

    store.toggleFavorite(5);

    expect(store.isPending(5)).toBe(true);
    expect(store.isFavorite(5)).toBe(false);

    response.next(undefined);
    response.complete();

    expect(store.isPending(5)).toBe(false);
    expect(store.isFavorite(5)).toBe(true);
  });

  it('empêche deux requêtes simultanées pour un même bien', () => {
    const response = new Subject<void>();

    apiMock.addFavorite.mockReturnValue(response);

    connect();

    store.toggleFavorite(5);
    store.toggleFavorite(5);

    expect(apiMock.addFavorite).toHaveBeenCalledTimes(1);

    response.next(undefined);
    response.complete();
  });

  it('conserve l’état initial si un ajout échoue', () => {
    apiMock.addFavorite.mockReturnValue(throwError(() => new Error('Erreur API')));

    connect();

    store.toggleFavorite(5);

    expect(store.isFavorite(5)).toBe(false);
    expect(store.isPending(5)).toBe(false);
    expect(store.hasFailed(5)).toBe(true);
    expect(store.count()).toBe(2);
  });

  it('conserve le favori si sa suppression échoue', () => {
    apiMock.removeFavorite.mockReturnValue(throwError(() => new Error('Erreur API')));

    connect();

    store.toggleFavorite(1);

    expect(store.isFavorite(1)).toBe(true);
    expect(store.hasFailed(1)).toBe(true);
    expect(store.count()).toBe(2);
  });

  it('gère une erreur de chargement', () => {
    apiMock.getFavorites.mockReturnValue(throwError(() => new Error('Erreur API')));

    connect();

    expect(store.status()).toBe('error');
    expect(store.isReady()).toBe(false);
  });

  it('relance un chargement ayant échoué', () => {
    apiMock.getFavorites
      .mockReturnValueOnce(throwError(() => new Error('Erreur API')))
      .mockReturnValueOnce(of([7]));

    connect();

    expect(store.status()).toBe('error');

    store.retryLoad();

    TestBed.tick();

    expect(store.status()).toBe('ready');
    expect(store.favoriteIds()).toEqual([7]);
    expect(apiMock.getFavorites).toHaveBeenCalledTimes(2);
  });

  it('vide les favoris après déconnexion', () => {
    connect();
    disconnect();

    expect(store.favoriteIds()).toEqual([]);
    expect(store.count()).toBe(0);
    expect(store.status()).toBe('idle');
  });

  it('isole les favoris de deux utilisateurs', () => {
    apiMock.getFavorites.mockReturnValueOnce(of([1, 3])).mockReturnValueOnce(of([8, 9]));

    connect('user-1');

    expect(store.favoriteIds()).toEqual([1, 3]);

    connect('user-2');

    expect(store.favoriteIds()).toEqual([8, 9]);
    expect(store.isFavorite(1)).toBe(false);
  });

  it('ignore une ancienne réponse après déconnexion', () => {
    const response = new Subject<number[]>();

    apiMock.getFavorites.mockReturnValue(response);

    connect();
    disconnect();

    response.next([1, 2, 3]);
    response.complete();

    expect(store.favoriteIds()).toEqual([]);
    expect(store.count()).toBe(0);
  });

  it('ignore un ajout encore en cours après un changement de compte', () => {
    const response = new Subject<void>();

    apiMock.addFavorite.mockReturnValue(response);

    apiMock.getFavorites.mockReturnValueOnce(of([1])).mockReturnValueOnce(of([8]));

    connect('user-1');

    store.toggleFavorite(5);

    connect('user-2');

    response.next(undefined);
    response.complete();

    expect(store.favoriteIds()).toEqual([8]);
    expect(store.isFavorite(5)).toBe(false);
  });
});
