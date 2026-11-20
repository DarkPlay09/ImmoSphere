import { isPlatformBrowser } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnChanges,
  OnDestroy,
  PLATFORM_ID,
  SimpleChanges,
  ViewChild,
  ViewEncapsulation,
  inject,
  input,
  output,
} from '@angular/core';

import * as L from 'leaflet';
import { PropertyMapItem } from '../../../notaries/models/property-map-tiem.model';



@Component({
  selector: 'app-property-map',
  standalone: true,
  templateUrl: './property-map.component.html',
  styleUrl: './property-map.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class PropertyMapComponent implements AfterViewInit, OnChanges, OnDestroy {
  @ViewChild('mapElement')
  private mapElement!: ElementRef<HTMLDivElement>;

  readonly properties = input.required<readonly PropertyMapItem[]>();
  readonly selectedPropertyId = input<number | null>(null);
  readonly ariaLabel = input('Carte interactive des biens immobiliers');

  readonly propertySelected = output<number>();

  private readonly platformId = inject(PLATFORM_ID);

  private map?: L.Map;
  private markerLayer?: L.LayerGroup;
  private readonly markers = new Map<number, L.Marker>();

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    this.map = L.map(this.mapElement.nativeElement, {
      zoomControl: false,
      scrollWheelZoom: false,
      attributionControl: false,
    }).setView([50.8503, 4.3517], 10);

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(this.map);

    L.control
      .zoom({
        position: 'topright',
      })
      .addTo(this.map);

    L.control
      .attribution({
        position: 'bottomleft',
      })
      .addTo(this.map);

    this.markerLayer = L.layerGroup().addTo(this.map);

    this.renderMarkers();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!this.map) return;

    if (changes['properties']) {
      this.renderMarkers();
    } else if (changes['selectedPropertyId']) {
      this.updateSelectedMarker();
    }
  }

  private createPriceIcon(property: PropertyMapItem, selected: boolean): L.DivIcon {
    const price = `${Math.round(property.price / 1000)}k€`;

    return L.divIcon({
      className: 'property-map__marker-wrapper',
      html: `
        <span class="property-map__price-marker ${
          selected ? 'property-map__price-marker--selected' : ''
        }">
          ${price}
        </span>
      `,
      iconSize: [64, 28],
      iconAnchor: [32, 14],
    });
  }

  private renderMarkers(): void {
    if (!this.map || !this.markerLayer) return;

    this.markerLayer.clearLayers();
    this.markers.clear();

    const properties = this.properties();

    for (const property of properties) {
      const marker = L.marker([property.latitude, property.longitude], {
        icon: this.createPriceIcon(property, property.id === this.selectedPropertyId()),
        keyboard: true,
        title: `${property.city} - ${property.price.toLocaleString('fr-BE')} €`,
      });

      marker.on('click', () => {
        this.propertySelected.emit(property.id);
      });

      marker.addTo(this.markerLayer);
      this.markers.set(property.id, marker);
    }

    if (properties.length > 0) {
      const bounds = L.latLngBounds(
        properties.map((property) => [property.latitude, property.longitude]),
      );

      this.map.fitBounds(bounds, {
        padding: [65, 65],
        maxZoom: 11,
        animate: false,
      });
    }

    this.updateSelectedMarker();
  }

  private updateSelectedMarker(): void {
    const selectedId = this.selectedPropertyId();

    for (const property of this.properties()) {
      const marker = this.markers.get(property.id);
      if (!marker) continue;

      const selected = property.id === selectedId;

      marker.setIcon(this.createPriceIcon(property, selected));
      marker.setZIndexOffset(selected ? 1000 : 0);
    }
  }

  focus(): void {
    const element = this.map?.getContainer();
    if (!element) return;

    element.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
    });

    element.focus();
  }

  ngOnDestroy(): void {
    this.map?.remove();
    this.markers.clear();
  }
}
