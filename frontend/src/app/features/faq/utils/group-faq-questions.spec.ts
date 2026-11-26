import { MOCK_FAQ_CATEGORIES, MOCK_FAQ_QUESTIONS } from '../data/faq.mock';
import { FaqQuestion } from '../models/faq.model';
import { groupFaqQuestions } from './group-faq-questions';

describe('groupFaqQuestions', () => {
  const question = (id: number, categoryCode: string | null): FaqQuestion => ({
    id,
    categoryCode,
    question: `Q${id}`,
    answer: `R${id}`,
  });

  it('regroupe les questions de la maquette dans l’ordre des catégories', () => {
    const groups = groupFaqQuestions(MOCK_FAQ_QUESTIONS, MOCK_FAQ_CATEGORIES);

    expect(groups.map((group) => group.categoryCode)).toEqual([
      'account',
      'searchProperty',
      'visitsAppointments',
      'publishProperty',
      'notariesReviews',
    ]);
    expect(groups.map((group) => group.questions.length)).toEqual([2, 2, 2, 2, 3]);
  });

  it('suit l’ordre des catégories même si les questions arrivent dans le désordre, en conservant leur ordre', () => {
    const categories = [
      { code: 'account', questionCount: 2 },
      { code: 'searchProperty', questionCount: 1 },
    ];

    const groups = groupFaqQuestions(
      [question(3, 'searchProperty'), question(2, 'account'), question(1, 'account')],
      categories,
    );

    expect(groups).toEqual([
      { categoryCode: 'account', questions: [question(2, 'account'), question(1, 'account')] },
      { categoryCode: 'searchProperty', questions: [question(3, 'searchProperty')] },
    ]);
  });

  it('place les questions sans catégorie ou de catégorie inconnue dans un dernier groupe « Autres »', () => {
    const groups = groupFaqQuestions(
      [question(1, null), question(2, 'account'), question(3, 'disparue')],
      [{ code: 'account', questionCount: 1 }],
    );

    expect(groups.map((group) => group.categoryCode)).toEqual(['account', null]);
    expect(groups[1]!.questions.map((item) => item.id)).toEqual([1, 3]);
  });

  it('omet les groupes vides et renvoie une liste vide sans question', () => {
    expect(groupFaqQuestions([question(1, 'account')], MOCK_FAQ_CATEGORIES)).toHaveLength(1);
    expect(groupFaqQuestions([], MOCK_FAQ_CATEGORIES)).toEqual([]);
  });
});
