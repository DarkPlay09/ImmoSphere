/**
 * FAQ publique (UC7, US 7.1).
 *
 * Contrat de `GET /api/faq?search=…&category=…` : l'API renvoie les catégories avec leur nombre de
 * questions et les questions, déjà filtrées par la recherche et la catégorie et triées par ordre
 * de catégorie. Les compteurs tiennent compte de la recherche mais pas de la catégorie.
 *
 * Correspondance avec la base : `id` ← `faq.id_faq`, `question` ← `faq.titre`, `answer` ← `faq.libelle`,
 * `categoryCode` / `code` ← `categorie_faq.code`. Le libellé d'une catégorie n'est pas stocké :
 * il est traduit avec la clé `faq.categories.<code>`.
 */
export interface FaqQuestion {
  id: number;
  /** Code de la catégorie, ou `null` pour une question sans catégorie (groupe « Autres »). */
  categoryCode: string | null;
  question: string;
  /** Une seule réponse en texte brut ; les retours à la ligne sont conservés à l'affichage. */
  answer: string;
}

export interface FaqCategory {
  /** Code stable en lowerCamelCase, utilisé comme clé de traduction. */
  code: string;
  /** Nombre de questions de la catégorie pour la recherche en cours (0 si aucune). */
  questionCount: number;
}

export interface FaqSearchResult {
  /** Nombre de questions trouvées, questions sans catégorie comprises. */
  totalCount: number;
  /** Toutes les catégories, dans leur ordre d'affichage. */
  categories: FaqCategory[];
  questions: FaqQuestion[];
}

/** Questions d'une même catégorie ; `categoryCode` vaut `null` pour le groupe « Autres ». */
export interface FaqQuestionGroup {
  categoryCode: string | null;
  questions: FaqQuestion[];
}

/** Longueur maximale du texte recherché, identique à la limite du back (400 `SEARCH_TOO_LONG` au-delà). */
export const FAQ_SEARCH_MAX_LENGTH = 100;
