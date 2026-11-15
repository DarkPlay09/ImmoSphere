import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PropertySearchCardComponent } from './property-search-card';
import { MOCK_PROPERTIES } from '../../data/properties.mock';

describe('PropertySearchCardComponent', () => {
  let component: PropertySearchCardComponent;
  let fixture: ComponentFixture<PropertySearchCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PropertySearchCardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PropertySearchCardComponent);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('property', {
      ...MOCK_PROPERTIES[0]!,
    });

    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should toggle favorite', () => {
    expect(component.favorite()).toBe(false);

    component.toggleFavorite();

    expect(component.favorite()).toBe(true);
  });
});
