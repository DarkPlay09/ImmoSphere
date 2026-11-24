import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { catchError, map, of, startWith, switchMap } from 'rxjs';

import { PropertyDetailApiService } from '../../data-access/property-detail-api.service';
import { BienDetailResponseDto } from '../../data-access/property-detail-response.model';
import { PropertyCharacteristicsComponent } from '../../components/property-characteristics/property-characteristics.component';
import { PropertyGalleryComponent } from '../../components/property-gallery/property-gallery.component';
import { PropertySummaryComponent } from '../../components/property-summary/property-summary.component';

type PropertyDetailState =
  | { status: 'loading' }
  | { status: 'success'; property: BienDetailResponseDto }
  | { status: 'not-found' }
  | { status: 'error' };

const LOADING_STATE: PropertyDetailState = {
  status: 'loading',
};

@Component({
  selector: 'app-property-detail',
  imports: [
    RouterLink,
    PropertyCharacteristicsComponent,
    PropertyGalleryComponent,
    PropertySummaryComponent,
  ],
  templateUrl: './property-detail.component.html',
  styleUrl: './property-detail.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PropertyDetailComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly propertyDetailApi = inject(PropertyDetailApiService);

  readonly state = toSignal(
    this.route.paramMap.pipe(
      map((parameters) => Number(parameters.get('id'))),

      switchMap((id) => {
        if (!Number.isInteger(id) || id <= 0) {
          return of<PropertyDetailState>({
            status: 'not-found',
          });
        }

        return this.propertyDetailApi.getById(id).pipe(
          map((property): PropertyDetailState => ({
            status: 'success',
            property,
          })),

          catchError((error: HttpErrorResponse) =>
            of<PropertyDetailState>(
              error.status === 404 ? { status: 'not-found' } : { status: 'error' },
            ),
          ),

          startWith<PropertyDetailState>(LOADING_STATE),
        );
      }),
    ),
    { initialValue: LOADING_STATE },
  );
}
