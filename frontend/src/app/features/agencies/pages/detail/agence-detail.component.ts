import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { Observable, catchError, map, of, startWith, switchMap } from 'rxjs';

import { Agence } from '../../models/agence.model';
import { AgencesService } from '../../data-access/agences.service';
import { AgenceAboutComponent } from '../../components/agence-about/agence-about.component';
import { AgenceHeaderComponent } from '../../components/agence-header/agence-header.component';
import { AgenceSpecsComponent } from '../../components/agence-specs/agence-specs.component';

type AgenceDetailState =
  | { status: 'loading' }
  | { status: 'found'; agence: Agence }
  | { status: 'not-found' }
  | { status: 'error' };

@Component({
  selector: 'app-agence-detail',
  standalone: true,
  imports: [AgenceAboutComponent, AgenceHeaderComponent, AgenceSpecsComponent, RouterLink, TranslatePipe],
  templateUrl: './agence-detail.component.html',
  styleUrl: './agence-detail.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AgenceDetailComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly agencesService = inject(AgencesService);

  readonly state = toSignal(
    this.route.paramMap.pipe(
      map((params) => Number(params.get('id'))),
      switchMap((id): Observable<AgenceDetailState> => {
        // Identifiant absent, non numérique ou négatif : inutile d'interroger le service.
        if (!Number.isInteger(id) || id <= 0) {
          return of({ status: 'not-found' });
        }

        return this.agencesService.getById(id).pipe(
          map((agence): AgenceDetailState => (agence ? { status: 'found', agence } : { status: 'not-found' })),
          // Erreur réseau, 400, 500… (la 404 AGENCE_NOT_FOUND est déjà convertie en `null` par le service).
          catchError(() => of<AgenceDetailState>({ status: 'error' })),
          startWith<AgenceDetailState>({ status: 'loading' }),
        );
      }),
    ),
    { initialValue: { status: 'loading' } as AgenceDetailState },
  );

  readonly agence = computed(() => {
    const state = this.state();
    return state.status === 'found' ? state.agence : null;
  });
}
