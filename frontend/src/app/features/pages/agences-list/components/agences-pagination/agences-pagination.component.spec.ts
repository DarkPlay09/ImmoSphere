import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideTranslateService } from '@ngx-translate/core';

import { AgencesPaginationComponent, buildPagination } from './agences-pagination.component';

describe('buildPagination', () => {
  it('affiche toutes les pages quand il y en a peu', () => {
    expect(buildPagination(1, 3)).toEqual([1, 2, 3]);
  });

  it('affiche 1 2 3 4 … 8 sur la première page', () => {
    expect(buildPagination(1, 8)).toEqual([1, 2, 3, 4, 'ellipsis', 8]);
  });

  it('entoure la page courante au milieu', () => {
    expect(buildPagination(5, 10)).toEqual([1, 'ellipsis', 4, 5, 6, 'ellipsis', 10]);
  });

  it('affiche les dernières pages en fin de liste', () => {
    expect(buildPagination(8, 8)).toEqual([1, 'ellipsis', 5, 6, 7, 8]);
  });
});

describe('AgencesPaginationComponent', () => {
  let fixture: ComponentFixture<AgencesPaginationComponent>;
  let emitted: number[];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AgencesPaginationComponent],
      providers: [provideTranslateService()],
    }).compileComponents();

    fixture = TestBed.createComponent(AgencesPaginationComponent);
    fixture.componentRef.setInput('page', 1);
    fixture.componentRef.setInput('pageCount', 3);
    emitted = [];
    fixture.componentInstance.pageChange.subscribe((page) => emitted.push(page));
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('marque la page courante et désactive « Précédent » sur la première page', () => {
    const element = fixture.nativeElement as HTMLElement;
    const navButtons = element.querySelectorAll<HTMLButtonElement>('.agences-pagination__nav');

    expect(element.querySelector('[aria-current="page"]')?.textContent?.trim()).toBe('1');
    expect(navButtons[0]?.disabled).toBe(true);
    expect(navButtons[1]?.disabled).toBe(false);
  });

  it('émet la page choisie et ignore la page courante ou hors bornes', () => {
    const component = fixture.componentInstance;

    component.goTo(2);
    component.goTo(1);
    component.goTo(0);
    component.goTo(4);

    expect(emitted).toEqual([2]);
  });
});
