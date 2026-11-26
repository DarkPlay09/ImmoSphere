import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { PropertyCardComponent } from './property-card.component';
import { PropertyFavoriteButtonComponent } from '../property-favorite-button/property-favorite-button.component';
import { Property } from '../../models/property.model';

import { Component, input, output } from '@angular/core';
import { By } from '@angular/platform-browser';

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

describe('PropertyCardComponent', () => {
  let component: PropertyCardComponent;
  let fixture: ComponentFixture<PropertyCardComponent>;

  const property: Property = {
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
      imports: [PropertyCardComponent],
      providers: [provideRouter([])],
    })
      .overrideComponent(PropertyCardComponent, {
        remove: {
          imports: [PropertyFavoriteButtonComponent],
        },
        add: {
          imports: [FavoriteButtonStubComponent],
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(PropertyCardComponent);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('property', property);

    fixture.detectChanges();
  });

  it('crée le composant', () => {
    expect(component).toBeTruthy();
  });

  it('masque le bouton favori par défaut', () => {
    expect(fixture.debugElement.query(By.directive(FavoriteButtonStubComponent))).toBeNull();
  });

  it('transmet le bon identifiant au bouton favori', () => {
    fixture.componentRef.setInput('favoritesEnabled', true);
    fixture.detectChanges();

    const button = fixture.debugElement.query(By.directive(FavoriteButtonStubComponent))
      .componentInstance as FavoriteButtonStubComponent;

    expect(button.propertyId()).toBe(property.id);
  });

  it('redirige vers la connexion sur demande', () => {
    const router = TestBed.inject(Router);

    const navigate = vi.spyOn(router, 'navigate').mockResolvedValue(true);

    fixture.componentRef.setInput('favoritesEnabled', true);
    fixture.detectChanges();

    const button = fixture.debugElement.query(By.directive(FavoriteButtonStubComponent))
      .componentInstance as FavoriteButtonStubComponent;

    button.loginRequested.emit();

    expect(navigate).toHaveBeenCalledWith(['/login']);
  });
});
