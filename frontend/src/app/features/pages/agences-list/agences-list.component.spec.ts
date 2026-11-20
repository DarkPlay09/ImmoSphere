import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideTranslateService } from '@ngx-translate/core';
import { of, throwError } from 'rxjs';

import { MOCK_AGENCES } from '../../../shared/agences/data/agences.mock';
import { AgenceSearchCriteria } from '../../../shared/agences/models/agence-search.model';
import { searchAgences } from '../../../shared/agences/data/agences-mock-search';
import { AgencesService } from '../../../shared/agences/services/agences.service';
import { AgencesListComponent } from './agences-list.component';

describe('AgencesListComponent', () => {
  let fixture: ComponentFixture<AgencesListComponent>;
  let component: AgencesListComponent;

  // Service synchrone pour les tests : mêmes règles de recherche, sans délai.
  const agencesServiceStub = {
    search: (criteria: AgenceSearchCriteria) => of(searchAgences(MOCK_AGENCES, criteria)),
  };

  const cards = (): number =>
    (fixture.nativeElement as HTMLElement).querySelectorAll('app-agence-card').length;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AgencesListComponent],
      providers: [
        provideRouter([]),
        provideTranslateService(),
        { provide: AgencesService, useValue: agencesServiceStub },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AgencesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('affiche la première page de 6 agences', () => {
    expect(component.total()).toBe(MOCK_AGENCES.length);
    expect(cards()).toBe(6);
  });

  it('change de page', async () => {
    component.goToPage(2);
    fixture.detectChanges();
    await fixture.whenStable();

    expect(component.page()).toBe(2);
    expect(cards()).toBe(MOCK_AGENCES.length - 6);
  });

  it('applique les champs du formulaire au clic sur Rechercher seulement', async () => {
    component.regionInput.set('brussels');
    fixture.detectChanges();
    await fixture.whenStable();
    expect(component.total()).toBe(MOCK_AGENCES.length);

    component.search();
    fixture.detectChanges();
    await fixture.whenStable();
    expect(component.total()).toBe(2);
  });

  it('revient à la première page après une recherche', async () => {
    component.goToPage(2);
    component.nameInput.set('immo');
    component.search();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(component.page()).toBe(1);
  });

  it('réinitialise la recherche en gardant le tri', async () => {
    component.changeSort({ target: { value: 'name' } } as unknown as Event);
    component.nameInput.set('horizon');
    component.search();
    component.reset();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(component.nameInput()).toBe('');
    expect(component.criteria().sort).toBe('name');
    expect(component.total()).toBe(MOCK_AGENCES.length);
  });
});

describe('AgencesListComponent en cas d’erreur', () => {
  it('affiche un message d’erreur si la recherche échoue', async () => {
    await TestBed.configureTestingModule({
      imports: [AgencesListComponent],
      providers: [
        provideRouter([]),
        provideTranslateService(),
        { provide: AgencesService, useValue: { search: () => throwError(() => new Error('réseau')) } },
      ],
    }).compileComponents();

    const fixture = TestBed.createComponent(AgencesListComponent);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    const element = fixture.nativeElement as HTMLElement;
    expect(fixture.componentInstance.error()).toBe(true);
    expect(fixture.componentInstance.loading()).toBe(false);
    expect(element.querySelector('.agences-list__message[role="alert"]')?.textContent).toContain('agences.loadError');
    expect(element.querySelectorAll('app-agence-card')).toHaveLength(0);
  });
});
