import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PebBadgeComponent } from './peb-badge.component';

describe('PebBadgeComponent', () => {
  let fixture: ComponentFixture<PebBadgeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PebBadgeComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PebBadgeComponent);
  });

  it('normalizes and styles an A++ rating', () => {
    fixture.componentRef.setInput('rating', ' a++ ');
    fixture.detectChanges();

    const badge: HTMLElement = fixture.nativeElement.querySelector('.peb-badge');
    expect(badge.textContent?.trim()).toBe('PEB A++');
    expect(badge.classList.contains('peb-badge--a-double-plus')).toBe(true);
  });

  it('applies the requested size and the G rating color', () => {
    fixture.componentRef.setInput('rating', 'G');
    fixture.componentRef.setInput('size', 'large');
    fixture.detectChanges();

    const badge: HTMLElement = fixture.nativeElement.querySelector('.peb-badge');
    expect(badge.classList.contains('peb-badge--large')).toBe(true);
    expect(badge.classList.contains('peb-badge--g')).toBe(true);
  });
});
