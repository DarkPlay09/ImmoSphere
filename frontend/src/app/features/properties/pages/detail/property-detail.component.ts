import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { catchError, map, of, startWith, switchMap } from 'rxjs';

import { PropertyDetailApiService } from '../../data-access/property-detail-api.service';
import { BienDetailResponseDto } from '../../data-access/property-detail-response.model';
import { PropertyAgentComponent } from '../../components/property-agent/property-agent.component';
import { PropertyCharacteristicsComponent } from '../../components/property-characteristics/property-characteristics.component';
import { PropertyAppointmentCardComponent } from '../../components/property-appointment-card/property-appointment-card.component';
import { PropertyConnectivityComponent } from '../../components/property-connectivity/property-connectivity.component';
import { PropertyDescriptionComponent } from '../../components/property-description/property-description.component';
import { PropertyGalleryComponent } from '../../components/property-gallery/property-gallery.component';
import { PropertyLoanSimulationComponent } from '../../components/property-loan-simulation/property-loan-simulation.component';
import { PropertyLocationComponent } from '../../components/property-location/property-location.component';
import { PropertyReviewsComponent } from '../../components/property-reviews/property-reviews.component';
import { PropertySummaryComponent } from '../../components/property-summary/property-summary.component';
import { PropertyVirtualTourComponent } from '../../components/property-virtual-tour/property-virtual-tour.component';

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
    TranslatePipe,
    PropertyAgentComponent,
    PropertyAppointmentCardComponent,
    PropertyCharacteristicsComponent,
    PropertyConnectivityComponent,
    PropertyDescriptionComponent,
    PropertyGalleryComponent,
    PropertyLoanSimulationComponent,
    PropertyLocationComponent,
    PropertyReviewsComponent,
    PropertySummaryComponent,
    PropertyVirtualTourComponent,
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
