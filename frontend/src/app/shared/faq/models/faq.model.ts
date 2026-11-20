/**
 * Question de la FAQ publique (UC7, US 7.1).
 *
 * Contrat de `GET /api/faq` : l'API renvoie un tableau de questions, déjà filtré par la
 * recherche et trié par ordre d'affichage. Le nombre de résultats est la longueur du tableau.
 *
 * Correspondance avec la table `faq` : `id` ← `id_faq`, `question` ← `titre`, `answer` ← `libelle`.
 * La base ne stocke ni catégorie ni traduction : le texte est renvoyé tel qu'il est enregistré.
 */
export interface FaqQuestion {
  id: number;
  question: string;
  /** Une seule réponse en texte brut ; les retours à la ligne sont conservés à l'affichage. */
  answer: string;
}

/** Longueur maximale du texte recherché, identique à la limite du back (400 `SEARCH_TOO_LONG` au-delà). */
export const FAQ_SEARCH_MAX_LENGTH = 100;
