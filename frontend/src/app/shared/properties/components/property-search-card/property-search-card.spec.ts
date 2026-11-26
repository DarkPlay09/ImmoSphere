import { Component, input, output } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideRouter, Router } from '@angular/router';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { PropertySearchCardComponent } from './property-search-card';
import { PropertyFavoriteButtonComponent } from '../property-favorite-button/property-favorite-button.component';
import { PropertySearchResult } from '../../models/property-search-result.model';

@Component({
  selector: 'app-property-favorite-button',
  standalone: true,
  template: '',
})
class FavoriteButtonStubComponent {
  readonly propertyId = input.required<number>();
  readonly size = input<string>('regular');
  readonly loginRequested = output<void>();
}

describe('PropertySearchCardComponent', () => {
  let component: PropertySearchCardComponent;
  let fixture: ComponentFixture<PropertySearchCardComponent>;

  const property: PropertySearchResult = {
    id: 1,
    title: 'Maison de test',
    price: 250000,
    city: 'Liège',
    postalCode: '4000',
    addressVisibility: 'city-only',
    imageUrl: '/images/test.png',
    transactionType: 'sale',
    isVisit360: false,
    bedrooms: 3,
    bathrooms: 1,
    areaM2: 120,
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PropertySearchCardComponent],
      providers: [provideRouter([])],
    })
      .overrideComponent(PropertySearchCardComponent, {
        remove: {
          imports: [PropertyFavoriteButtonComponent],
        },
        add: {
          imports: [FavoriteButtonStubComponent],
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(PropertySearchCardComponent);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('property', property);
    fixture.detectChanges();
  });

  it('crée le composant', () => {
    expect(component).toBeTruthy();
  });

  it('transmet le bon identifiant au bouton favori', () => {
    const button = fixture.debugElement.query(By.directive(FavoriteButtonStubComponent))
      .componentInstance as FavoriteButtonStubComponent;

    expect(button.propertyId()).toBe(property.id);
    expect(button.size()).toBe('small');
  });

  it('redirige vers la connexion sur demande', () => {
    const navigate = vi.spyOn(TestBed.inject(Router), 'navigate').mockResolvedValue(true);

    const button = fixture.debugElement.query(By.directive(FavoriteButtonStubComponent))
      .componentInstance as FavoriteButtonStubComponent;

    button.loginRequested.emit();

    expect(navigate).toHaveBeenCalledWith(['/login']);
  });

  it('émet l’identifiant du bien lors de la demande de détails', () => {
    const emit = vi.spyOn(component.detailsRequested, 'emit');

    component.openDetails();

    expect(emit).toHaveBeenCalledWith(property.id);
  });
});
