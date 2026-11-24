import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideTranslateService } from '@ngx-translate/core';

import { MOCK_FAQ_QUESTIONS } from '../../data/faq.mock';
import { FaqAccordionItemComponent } from './faq-accordion-item.component';

// Tests de l'US 7.1 : la réponse se déplie au clic et la flèche change de sens.
describe('FaqAccordionItemComponent', () => {
  let fixture: ComponentFixture<FaqAccordionItemComponent>;
  const item = MOCK_FAQ_QUESTIONS[5]!;

  const element = (): HTMLElement => fixture.nativeElement as HTMLElement;
  const toggle = (): HTMLButtonElement => element().querySelector<HTMLButtonElement>('.faq-item__toggle')!;
  const panel = (): HTMLElement => element().querySelector<HTMLElement>('.faq-item__panel')!;
  const arrow = (): HTMLElement => element().querySelector<HTMLElement>('.faq-item__arrow')!;

  const click = (): void => {
    toggle().click();
    fixture.detectChanges();
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FaqAccordionItemComponent],
      providers: [provideTranslateService()],
    }).compileComponents();

    fixture = TestBed.createComponent(FaqAccordionItemComponent);
    fixture.componentRef.setInput('item', item);
    fixture.detectChanges();
  });

  it('affiche la question dans un bouton, réponse masquée et flèche fermée', () => {
    expect(toggle().type).toBe('button');
    expect(toggle().textContent).toContain(item.question);
    expect(toggle().getAttribute('aria-expanded')).toBe('false');
    expect(panel().hidden).toBe(true);
    expect(arrow().classList).not.toContain('faq-item__arrow--open');
    expect(arrow().getAttribute('aria-hidden')).toBe('true');
  });

  it('relie le bouton à la zone de réponse', () => {
    expect(toggle().getAttribute('aria-controls')).toBe(panel().id);
    expect(panel().getAttribute('aria-labelledby')).toBe(toggle().id);
  });

  it('affiche la réponse au clic et tourne la flèche', () => {
    click();

    expect(panel().hidden).toBe(false);
    expect(panel().textContent).toContain(item.answer);
    expect(toggle().getAttribute('aria-expanded')).toBe('true');
    expect(arrow().classList).toContain('faq-item__arrow--open');
  });

  it('masque la réponse au second clic et remet la flèche dans son sens initial', () => {
    click();
    click();

    expect(panel().hidden).toBe(true);
    expect(toggle().getAttribute('aria-expanded')).toBe('false');
    expect(arrow().classList).not.toContain('faq-item__arrow--open');
  });
});
