import { FaqCategory, FaqQuestion, FaqSearchResult } from '../models/faq.model';

/** Codes des catégories de la maquette, dans leur ordre d'affichage (table `categorie_faq`). */
const MOCK_FAQ_CATEGORY_CODES = [
  'account',
  'searchProperty',
  'visitsAppointments',
  'publishProperty',
  'notariesReviews',
] as const;

/**
 * Questions de la maquette Figma (cadre « FAQ » 328:12048), dans l'ordre d'affichage, avec leur catégorie.
 * Seule la réponse sur la visite 360° vient de la maquette ; les autres sont des textes factices.
 */
export const MOCK_FAQ_QUESTIONS: FaqQuestion[] = [
  {
    id: 1,
    categoryCode: 'account',
    question: 'Comment créer un compte ImmoSphere ?',
    answer:
      'Cliquez sur « Se connecter » puis choisissez de créer un compte. Renseignez votre adresse e-mail et un mot de passe, puis confirmez votre adresse grâce au code reçu par e-mail.',
  },
  {
    id: 2,
    categoryCode: 'account',
    question: 'Comment réinitialiser mon mot de passe ?',
    answer:
      'Sur la page de connexion, choisissez « Mot de passe oublié » et indiquez votre adresse e-mail. Vous recevrez un lien pour définir un nouveau mot de passe.',
  },
  {
    id: 3,
    categoryCode: 'searchProperty',
    question: 'Comment rechercher un bien immobilier ?',
    answer:
      'Utilisez la barre de recherche ou les menus « Acheter » et « Louer », puis affinez les résultats avec les filtres de localisation, de prix et de caractéristiques.',
  },
  {
    id: 4,
    categoryCode: 'searchProperty',
    question: 'Comment enregistrer un bien en favoris ?',
    answer:
      'Une fois connecté, cliquez sur l’icône en forme de cœur d’une annonce. Vous retrouvez ensuite tous vos biens favoris depuis votre espace personnel.',
  },
  {
    id: 5,
    categoryCode: 'visitsAppointments',
    question: 'Comment demander une visite immobilière ?',
    answer:
      'Ouvrez la fiche du bien et choisissez l’un des créneaux proposés par l’agence ou le vendeur. Vous recevez une confirmation dès que le rendez-vous est accepté.',
  },
  {
    id: 6,
    categoryCode: 'visitsAppointments',
    question: 'Comment fonctionne une visite virtuelle 360° ?',
    answer:
      'Lorsqu’un bien propose une visite 360°, vous pouvez explorer ses vues panoramiques et passer d’une pièce à une autre grâce aux commandes disponibles.',
  },
  {
    id: 7,
    categoryCode: 'publishProperty',
    question: 'Comment publier une annonce ?',
    answer:
      'Connectez-vous avec un compte autorisé, cliquez sur « Publier un bien » et complétez les informations demandées : description, photos, prix et certificat PEB.',
  },
  {
    id: 8,
    categoryCode: 'publishProperty',
    question: 'Puis-je enregistrer une annonce sans la publier ?',
    answer:
      'Oui. Une annonce peut être enregistrée comme brouillon et complétée plus tard. Elle n’est visible par les visiteurs qu’après sa publication.',
  },
  {
    id: 9,
    categoryCode: 'notariesReviews',
    question: 'Suis-je obligé de choisir un notaire sur ImmoSphere ?',
    answer:
      'Non. Les notaires présents sur ImmoSphere vous sont proposés pour faciliter vos démarches, mais vous restez libre de faire appel au notaire de votre choix.',
  },
  {
    id: 10,
    categoryCode: 'notariesReviews',
    question: 'Comment publier un avis sur un bien acheté ?',
    answer:
      'Une fois la vente finalisée, un lien vous permet de donner votre avis sur le bien et sur l’accompagnement reçu. Les avis sont vérifiés avant leur publication.',
  },
  {
    id: 11,
    categoryCode: 'notariesReviews',
    question: 'Comment contacter une agence ou un notaire ?',
    answer:
      'Ouvrez la fiche de l’agence ou du notaire : ses coordonnées et un bouton de contact y sont indiqués.',
  },
];

/** Catégories avec le nombre de questions de `MOCK_FAQ_QUESTIONS`. */
export const MOCK_FAQ_CATEGORIES: FaqCategory[] = MOCK_FAQ_CATEGORY_CODES.map((code) => ({
  code,
  questionCount: MOCK_FAQ_QUESTIONS.filter((question) => question.categoryCode === code).length,
}));

/** Réponse de `GET /api/faq` sans critère. */
export const MOCK_FAQ_RESULT: FaqSearchResult = {
  totalCount: MOCK_FAQ_QUESTIONS.length,
  categories: MOCK_FAQ_CATEGORIES,
  questions: MOCK_FAQ_QUESTIONS,
};
