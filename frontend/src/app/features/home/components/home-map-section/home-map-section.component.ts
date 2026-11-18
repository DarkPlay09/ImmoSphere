import {
  ChangeDetectionStrategy,
  Component,
  ViewChild,
  computed,
  inject,
  signal,
} from '@angular/core';

import { toSignal } from '@angular/core/rxjs-interop';
import { TranslatePipe } from '@ngx-translate/core';
import { catchError, map, of, tap } from 'rxjs';

import { PropertyMapComponent } from '../../../../shared/properties/components/property-map/property-map.component';

import { Property } from '../../../../shared/properties/models/property.model';

import {
  BelgiumRegion,
  PropertyMapItem,
  PropertyMapKind,
} from '../../../../shared/notaries/models/property-map-tiem.model';

import { HomePropertiesApiService } from '../../data-access/home-properties-api.service';

import { getMapCityCenter, normalizeCity } from '../../data-access/map-city-centers';

type RegionFilter = BelgiumRegion | 'all';

// On garde le modèle Leaflet existant.
// Le titre sert uniquement à l'aperçu du bien.
type MapProperty = PropertyMapItem & {
  title: string;
};

@Component({
  selector: 'app-home-map-section',
  standalone: true,
  imports: [TranslatePipe, PropertyMapComponent],
  templateUrl: './home-map-section.component.html',
  styleUrl: './home-map-section.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeMapSectionComponent {
  private readonly api = inject(HomePropertiesApiService);

  @ViewChild(PropertyMapComponent)
  private propertyMap?: PropertyMapComponent;

  readonly loading = signal(true);
  readonly error = signal(false);

  readonly activeRegion = signal<RegionFilter>('all');
  readonly selectedPropertyId = signal<number | null>(null);

  readonly regions: readonly {
    value: RegionFilter;
    labelKey: string;
  }[] = [
    { value: 'all', labelKey: 'home.map.allBelgium' },
    { value: 'brussels', labelKey: 'home.map.brussels' },
    { value: 'flanders', labelKey: 'home.map.flanders' },
    { value: 'wallonia', labelKey: 'home.map.wallonia' },
  ];

  /**
   * Récupère les biens depuis l'API déjà utilisée
   * par les dernières annonces.
   */
  readonly properties = toSignal(
    this.api.getProperties().pipe(
      map((properties) => this.toMapProperties(properties)),

      tap((properties) => {
        this.selectedPropertyId.set(properties[0]?.id ?? null);

        this.loading.set(false);
      }),

      catchError((error) => {
        console.error('Erreur lors du chargement de la carte :', error);

        this.error.set(true);
        this.loading.set(false);

        return of([] as MapProperty[]);
      }),
    ),
    {
      initialValue: [] as MapProperty[],
    },
  );

  readonly visibleProperties = computed(() => {
    const region = this.activeRegion();
    const properties = this.properties();

    if (region === 'all') {
      return properties;
    }

    return properties.filter((property) => property.region === region);
  });

  readonly selectedProperty = computed(() => {
    const selectedId = this.selectedPropertyId();

    return this.visibleProperties().find((property) => property.id === selectedId) ?? null;
  });

  /**
   * Adapte les annonces du backend au modèle
   * déjà attendu par PropertyMapComponent.
   */
  private toMapProperties(properties: readonly Property[]): MapProperty[] {
    const cityOccurrences = new Map<string, number>();

    return properties.flatMap((property) => {
      const location = getMapCityCenter(property.city);

      if (!location) {
        // Aucune coordonnée inventée pour une
        // commune que nous ne connaissons pas.
        return [];
      }

      const cityKey = normalizeCity(property.city);

      const occurrence = cityOccurrences.get(cityKey) ?? 0;

      cityOccurrences.set(cityKey, occurrence + 1);

      /**
       * Plusieurs biens d'une même commune
       * auraient exactement le même marqueur.
       *
       * Nous décalons légèrement les marqueurs
       * autour du centre pour qu'ils soient cliquables.
       *
       * Ce sont toujours des positions indicatives.
       */
      const angle = occurrence * 2.39996;
      const radius = occurrence === 0 ? 0 : 0.006 * Math.sqrt(occurrence);

      return [
        {
          id: property.id,
          title: property.title,
          price: property.price,

          city: property.city,
          postalCode: property.postalCode,
          region: location.region,

          latitude: location.latitude + Math.sin(angle) * radius,

          longitude: location.longitude + Math.cos(angle) * radius,

          kind: this.getPropertyKind(property.title),
          imageUrl: property.imageUrl,
          peb: property.peb,
        },
      ];
    });
  }

  /**
   * Type indicatif utilisé par notre ancien
   * modèle de carte.
   *
   * Dans l'aperçu, nous affichons désormais
   * le vrai titre de l'annonce.
   */
  private getPropertyKind(title: string): PropertyMapKind {
    const value = title.toLowerCase();

    if (value.includes('penthouse')) {
      return 'penthouse';
    }

    if (value.includes('villa')) {
      return 'villa';
    }

    if (value.includes('maison')) {
      return 'house';
    }

    return 'apartment';
  }

  selectRegion(region: RegionFilter): void {
    this.activeRegion.set(region);

    const firstProperty = this.visibleProperties()[0];

    this.selectedPropertyId.set(firstProperty?.id ?? null);
  }

  selectProperty(propertyId: number): void {
    this.selectedPropertyId.set(propertyId);
  }

  focusMap(): void {
    this.propertyMap?.focus();
  }
}
