import { FaqCategory, FaqQuestion, FaqQuestionGroup } from '../models/faq.model';

/**
 * Regroupe les questions par catégorie, dans l'ordre des catégories. Les questions sans catégorie
 * (ou d'une catégorie absente de la liste) forment un dernier groupe `null` (« Autres »).
 * Les groupes vides sont omis ; l'ordre des questions dans un groupe est conservé.
 */
export function groupFaqQuestions(
  questions: readonly FaqQuestion[],
  categories: readonly FaqCategory[],
): FaqQuestionGroup[] {
  const byCategory = new Map<string | null, FaqQuestion[]>();
  const knownCodes = new Set(categories.map((category) => category.code));

  for (const question of questions) {
    const code = question.categoryCode !== null && knownCodes.has(question.categoryCode) ? question.categoryCode : null;
    byCategory.set(code, [...(byCategory.get(code) ?? []), question]);
  }

  return [...categories.map((category) => category.code), null]
    .filter((code) => byCategory.has(code))
    .map((code) => ({ categoryCode: code, questions: byCategory.get(code)! }));
}
