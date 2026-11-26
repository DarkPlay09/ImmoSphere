import { computed, effect, inject, Injectable, signal } from '@angular/core';

import { Subscription } from 'rxjs';

import { AuthSessionService } from '../../../features/auth/data-access/auth-session.service';
import { PropertyFavoritesApiService } from './property-favorites-api.service';

type FavoritesStatus = 'idle' | 'loading' | 'ready' | 'error';

interface FavoritesState {
  userId: string | null;
  ids: ReadonlySet<number>;
  pendingIds: ReadonlySet<number>;
  failedIds: ReadonlySet<number>;
  status: FavoritesStatus;
}

function emptyState(userId: string | null = null): FavoritesState {
  return {
    userId,
    ids: new Set<number>(),
    pendingIds: new Set<number>(),
    failedIds: new Set<number>(),
    status: 'idle',
  };
}

@Injectable({
  providedIn: 'root',
})
export class PropertyFavoritesStore {
  private readonly api = inject(PropertyFavoritesApiService);
  private readonly session = inject(AuthSessionService);

  private readonly state = signal<FavoritesState>(emptyState());
  private readonly reloadVersion = signal(0);

  private activeRequests: Subscription | null = null;

  private readonly userId = computed(() =>
    this.session.isAuthenticated() ? (this.session.user()?.id ?? null) : null,
  );

  private readonly currentState = computed(() => {
    const state = this.state();
    const userId = this.userId();

    return userId !== null && state.userId === userId ? state : emptyState();
  });

  readonly status = computed(() => this.currentState().status);

  readonly isLoading = computed(() => this.status() === 'loading');

  readonly isReady = computed(() => this.status() === 'ready');

  readonly favoriteIds = computed(() => Array.from(this.currentState().ids));

  readonly count = computed(() => this.currentState().ids.size);

  constructor() {
    effect((onCleanup) => {
      const userId = this.userId();

      this.reloadVersion();

      const requests = new Subscription();
      this.activeRequests = requests;

      onCleanup(() => {
        requests.unsubscribe();

        if (this.activeRequests === requests) {
          this.activeRequests = null;
        }
      });

      this.state.set(emptyState(userId));

      if (userId === null) {
        return;
      }

      this.state.update((state) => ({
        ...state,
        status: 'loading',
      }));

      requests.add(
        this.api.getFavorites().subscribe({
          next: (ids) => {
            if (!this.isCurrentSession(userId, requests)) {
              return;
            }

            this.state.update((state) => ({
              ...state,
              ids: new Set(ids),
              status: 'ready',
            }));
          },

          error: () => {
            if (!this.isCurrentSession(userId, requests)) {
              return;
            }

            this.state.update((state) => ({
              ...state,
              status: 'error',
            }));
          },
        }),
      );
    });
  }

  isFavorite(propertyId: number): boolean {
    return this.currentState().ids.has(propertyId);
  }

  isPending(propertyId: number): boolean {
    return this.currentState().pendingIds.has(propertyId);
  }

  hasFailed(propertyId: number): boolean {
    return this.currentState().failedIds.has(propertyId);
  }

  retryLoad(): void {
    if (this.userId() !== null && this.status() === 'error') {
      this.reloadVersion.update((value) => value + 1);
    }
  }

  toggleFavorite(propertyId: number): void {
    const userId = this.userId();
    const requests = this.activeRequests;

    if (
      userId === null ||
      requests === null ||
      !this.isReady() ||
      this.isPending(propertyId) ||
      !Number.isSafeInteger(propertyId) ||
      propertyId <= 0
    ) {
      return;
    }

    const wasFavorite = this.isFavorite(propertyId);

    this.state.update((state) => {
      const pendingIds = new Set(state.pendingIds);
      const failedIds = new Set(state.failedIds);

      pendingIds.add(propertyId);
      failedIds.delete(propertyId);

      return {
        ...state,
        pendingIds,
        failedIds,
      };
    });

    const request = wasFavorite
      ? this.api.removeFavorite(propertyId)
      : this.api.addFavorite(propertyId);

    requests.add(
      request.subscribe({
        next: () => {
          if (!this.isCurrentSession(userId, requests)) {
            return;
          }

          this.state.update((state) => {
            const ids = new Set(state.ids);
            const pendingIds = new Set(state.pendingIds);

            if (wasFavorite) {
              ids.delete(propertyId);
            } else {
              ids.add(propertyId);
            }

            pendingIds.delete(propertyId);

            return {
              ...state,
              ids,
              pendingIds,
            };
          });
        },

        error: () => {
          if (!this.isCurrentSession(userId, requests)) {
            return;
          }

          this.state.update((state) => {
            const pendingIds = new Set(state.pendingIds);
            const failedIds = new Set(state.failedIds);

            pendingIds.delete(propertyId);
            failedIds.add(propertyId);

            return {
              ...state,
              pendingIds,
              failedIds,
            };
          });
        },
      }),
    );
  }

  private isCurrentSession(userId: string, requests: Subscription): boolean {
    return this.activeRequests === requests && !requests.closed && this.userId() === userId;
  }
}
