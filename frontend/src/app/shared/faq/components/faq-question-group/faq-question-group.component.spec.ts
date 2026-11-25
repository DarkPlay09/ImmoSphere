import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideTranslateService } from '@ngx-translate/core';

import { MOCK_FAQ_QUESTIONS } from '../../data/faq.mock';
import { FaqQuestionGroup } from '../../models/faq.model';
import { FaqQuestionGroupComponent } from './faq-question-group.component';

describe('FaqQuestionGroupComponent', () => {
  let fixture: ComponentFixture<FaqQuestionGroupComponent>;

  const element = (): HTMLElement => fixture.nativeElement as HTMLElement;

  const render = (group: FaqQuestionGroup): void => {
    fixture.componentRef.setInput('group', group);
    fixture.detectChanges();
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FaqQuestionGroupComponent],
      providers: [provideTranslateService()],
    }).compileComponents();

    fixture = TestBed.createComponent(FaqQuestionGroupComponent);
  });

  it('affiche le titre traduit de la catégorie, son icône et ses questions', () => {
    render({ categoryCode: 'account', questions: MOCK_FAQ_QUESTIONS.slice(0, 2) });

    const heading = element().querySelector('h2');
    expect(heading?.textContent).toContain('faq.categories.account');
    expect(element().querySelector('.faq-group__icon')?.getAttribute('aria-hidden')).toBe('true');
    expect(element().querySelectorAll('app-faq-accordion-item')).toHaveLength(2);
  });

  it('nomme la section par son titre pour les lecteurs d’écran', () => {
    render({ categoryCode: 'account', questions: MOCK_FAQ_QUESTIONS.slice(0, 1) });

    const section = element().querySelector('section');
    const heading = element().querySelector('h2');
    expect(heading?.id).toBe('faq-group-account');
    expect(section?.getAttribute('aria-labelledby')).toBe(heading?.id);
  });

  it('affiche « Autres », sans icône, pour les questions sans catégorie', () => {
    render({ categoryCode: null, questions: [{ ...MOCK_FAQ_QUESTIONS[0]!, categoryCode: null }] });

    expect(element().querySelector('h2')?.textContent).toContain('faq.otherCategory');
    expect(element().querySelector('h2')?.id).toBe('faq-group-other');
    expect(element().querySelector('.faq-group__icon')).toBeNull();
  });
});
