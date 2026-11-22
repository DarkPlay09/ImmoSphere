import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideTranslateService } from '@ngx-translate/core';

import { FaqAnswerRatingComponent } from './faq-answer-rating.component';

describe('FaqAnswerRatingComponent', () => {
  let fixture: ComponentFixture<FaqAnswerRatingComponent>;

  const buttons = (): HTMLButtonElement[] =>
    Array.from((fixture.nativeElement as HTMLElement).querySelectorAll<HTMLButtonElement>('.faq-rating__button'));
  const pressed = (): (string | null)[] => buttons().map((button) => button.getAttribute('aria-pressed'));

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FaqAnswerRatingComponent],
      providers: [provideTranslateService()],
    }).compileComponents();

    fixture = TestBed.createComponent(FaqAnswerRatingComponent);
    fixture.componentRef.setInput('questionId', 6);
    fixture.detectChanges();
  });

  it('ne présélectionne aucune évaluation', () => {
    expect(pressed()).toEqual(['false', 'false']);
  });

  it('garde une seule évaluation active et la retire au second clic', () => {
    const [useful, notUseful] = buttons();

    useful!.click();
    fixture.detectChanges();
    expect(pressed()).toEqual(['true', 'false']);

    notUseful!.click();
    fixture.detectChanges();
    expect(pressed()).toEqual(['false', 'true']);

    notUseful!.click();
    fixture.detectChanges();
    expect(pressed()).toEqual(['false', 'false']);
  });
});
