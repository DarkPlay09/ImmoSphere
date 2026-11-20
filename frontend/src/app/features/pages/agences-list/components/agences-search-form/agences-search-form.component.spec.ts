import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideTranslateService } from '@ngx-translate/core';

import { AgencesSearchFormComponent } from './agences-search-form.component';

describe('AgencesSearchFormComponent', () => {
  let fixture: ComponentFixture<AgencesSearchFormComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AgencesSearchFormComponent],
      providers: [provideTranslateService()],
    }).compileComponents();

    fixture = TestBed.createComponent(AgencesSearchFormComponent);
    fixture.detectChanges();
    await fixture.whenStable();
    element = fixture.nativeElement as HTMLElement;
  });

  it('met à jour les champs à la saisie', () => {
    const input = element.querySelector<HTMLInputElement>('#agences-search-name')!;
    input.value = 'horizon';
    input.dispatchEvent(new Event('input'));

    const select = element.querySelector<HTMLSelectElement>('#agences-search-region')!;
    select.value = 'flanders';
    select.dispatchEvent(new Event('change'));

    expect(fixture.componentInstance.name()).toBe('horizon');
    expect(fixture.componentInstance.region()).toBe('flanders');
  });

  it('émet la recherche à la soumission et la réinitialisation au clic', () => {
    let searched = 0;
    let resets = 0;
    fixture.componentInstance.searched.subscribe(() => searched++);
    fixture.componentInstance.resetRequested.subscribe(() => resets++);

    element.querySelector('form')!.dispatchEvent(new Event('submit'));
    element.querySelector<HTMLButtonElement>('.agences-search__button--reset')!.click();

    expect(searched).toBe(1);
    expect(resets).toBe(1);
  });
});
