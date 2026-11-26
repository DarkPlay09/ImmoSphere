/** Code de l'icône « Toutes les questions » (aucun filtre). */
export const FAQ_ALL_CATEGORIES_ICON = 'all';

/**
 * Masque CSS de l'icône d'une catégorie (`public/icons/faq/category-<code>.svg`). L'icône est
 * utilisée comme masque pour prendre la couleur du texte (grise, ou violette si active).
 */
export function faqCategoryIconMask(code: string): string {
  return `url('/icons/faq/category-${code}.svg')`;
}
