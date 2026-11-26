import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideTranslateService } from '@ngx-translate/core';

import { MOCK_FAQ_CATEGORIES } from '../../data/faq.mock';
import { FaqCategoryNavComponent } from './faq-category-nav.component';

describe('FaqCategoryNavComponent', () => {
  let fixture: ComponentFixture<FaqCategoryNavComponent>;
  let component: FaqCategoryNavComponent;

  const element = (): HTMLElement => fixture.nativeElement as HTMLElement;
  const buttons = (): HTMLButtonElement[] => [
    ...element().querySelectorAll<HTMLButtonElement>('.faq-category-nav__item'),
  ];
  const counts = (): string[] => buttons().map((button) => button.querySelector('.faq-category-nav__count')!.textContent!.trim());

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FaqCategoryNavComponent],
      providers: [provideTranslateService()],
    }).compileComponents();

    fixture = TestBed.createComponent(FaqCategoryNavComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('categories', MOCK_FAQ_CATEGORIES);
    fixture.componentRef.setInput('totalCount', 14);
    fixture.detectChanges();
  });

  it('affiche « Toutes » avec le total, puis chaque catégorie avec son nombre de questions', () => {
    expect(buttons()).toHaveLength(MOCK_FAQ_CATEGORIES.length + 1);
    expect(buttons()[0]!.textContent).toContain('faq.allCategories');
    expect(buttons()[1]!.textContent).toContain('faq.categories.account');
    expect(counts()).toEqual(['14', '2', '2', '2', '2', '3']);
  });

  it('active « Toutes » par défaut', () => {
    expect(buttons().map((button) => button.getAttribute('aria-pressed'))).toEqual([
      'true',
      'false',
      'false',
      'false',
      'false',
      'false',
    ]);
    expect(buttons()[0]!.classList).toContain('faq-category-nav__item--active');
  });

  it('sélectionne une catégorie au clic et met en évidence la catégorie active', () => {
    buttons()[3]!.click();
    fixture.detectChanges();

    expect(component.selected()).toBe('visitsAppointments');
    expect(buttons()[3]!.getAttribute('aria-pressed')).toBe('true');
    expect(buttons()[3]!.classList).toContain('faq-category-nav__item--active');
    expect(buttons()[0]!.getAttribute('aria-pressed')).toBe('false');

    buttons()[0]!.click();
    fixture.detectChanges();
    expect(component.selected()).toBeNull();
  });

  it('est une navigation nommée, avec des boutons dont le nom inclut le nombre de questions', () => {
    const nav = element().querySelector('nav');
    expect(nav?.getAttribute('aria-label')).toBe('faq.categoryNav.label');
    expect(buttons().every((button) => button.type === 'button')).toBe(true);
    expect(buttons()[0]!.getAttribute('aria-label')).toBe('faq.categoryNav.itemLabel');
    // Le compteur visible est masqué aux lecteurs d'écran : il est déjà dans le nom accessible.
    expect(buttons()[0]!.querySelector('.faq-category-nav__count')?.getAttribute('aria-hidden')).toBe('true');
  });

  it('utilise la clé au singulier quand il n’y a qu’une question', () => {
    expect(component.totalKey()).toBe('faq.categoryNav.count');
    fixture.componentRef.setInput('totalCount', 1);
    expect(component.totalKey()).toBe('faq.categoryNav.countOne');
  });
});
