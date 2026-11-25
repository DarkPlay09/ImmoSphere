/**
 * Modèle d'une agence immobilière (UC37).
 *
 * Base du futur contrat d'API (KAN-242). Les champs viennent de deux sources :
 * - `AgenceEntity` côté backend (nom, description, logo, adresse, téléphone, mail, site, BCE) ;
 * - la maquette Figma (cadres « Agences » 183:1169 et « Détails d'une agence » 183:1751).
 *
 * Les champs marqués « absent de AgenceEntity » n'existent pas encore en base :
 * ils restent optionnels et ne doivent pas entraîner de modification de la base
 * sans l'accord de l'équipe.
 */
export interface Agence {
  /** AgenceEntity.Id */
  id: number;
  /** AgenceEntity.Nom */
  name: string;
  /** AgenceEntity.Description : texte court affiché sur la carte et dans l'en-tête. */
  description: string;
  /** AgenceEntity.Logo. Vide : un placeholder est affiché. */
  logoUrl?: string;

  // Adresse (AgenceEntity.Localite, Rue, Numero, CodePostal)
  city: string;
  street?: string;
  number?: string;
  postalCode: string;
  /** Absent de AgenceEntity : quartier ou zone affiché après la ville (« Quai de la Meuse & Centre »). */
  district?: string;
  /**
   * Absent de AgenceEntity : déduite du code postal par l'API, qui l'omet si le code
   * postal n'est pas belge. Sert au filtre par région de la liste, jamais affichée.
   */
  region?: AgenceRegion;

  // Contact
  /** AgenceEntity.NumeroTel */
  phone?: string;
  /** AgenceEntity.Mail */
  email?: string;
  /** AgenceEntity.LienPlateforme */
  website?: string;

  // Agréments
  /** AgenceEntity.Bce */
  bce?: string;
  /** Absent de AgenceEntity : numéro d'agrément IPI (« Agréée IPI N° 508.914 »). */
  ipiNumber?: string;
  /** Absent de AgenceEntity : badge « Membre Federia ». */
  federiaMember?: boolean;

  /** Absent de AgenceEntity : horaires d'ouverture (bloc coordonnées du profil). */
  openingHours?: AgenceOpeningHours[];

  /** Absent de AgenceEntity : tags de la carte et de l'en-tête (« Vente », « Location »…). */
  tags: string[];

  /** Absent de AgenceEntity : section « À propos » du profil, un élément par paragraphe. */
  about?: string[];
  /** Absent de AgenceEntity : encarts « Conformité légale », « Expertise PEB »… de la section « À propos ». */
  highlights?: AgenceHighlight[];

  /**
   * Section « Spécifications de l'agence ».
   * En base, AgenceSpecificationEntity relie l'agence à une liste générique de
   * SpecificationEntity (Titre, Description, Emoticon) : la correspondance avec
   * ces 4 catégories reste à définir dans le contrat d'API.
   */
  specifications: AgenceSpecifications;

  // Hors périmètre UC37 (avis : autre UC, biens : autre UC). Affichés seulement s'ils sont fournis.
  /** Absent de AgenceEntity : note moyenne sur 5. */
  rating?: number;
  /** Absent de AgenceEntity : nombre d'avis clients vérifiés. */
  reviewCount?: number;
  /** Absent de AgenceEntity : nombre de biens disponibles. */
  propertyCount?: number;
}

/** Clés alignées sur `footer.regions` des traductions. */
export type AgenceRegion = 'brussels' | 'flanders' | 'wallonia';

export interface AgenceSpecifications {
  /** « Zone d'activité prioritaire » */
  zone: string;
  /** « Typologies de biens gérées » */
  propertyTypes: string;
  /** « Pôles de transaction » */
  transactionPoles: string;
  /** « Langues véhiculées » */
  languages: AgenceLanguage[];
}

export interface AgenceLanguage {
  /** Libellé traduit via `navbar.languages.<code>`. */
  code: 'fr' | 'nl' | 'de' | 'en';
  /** Affiche la mention « maternelle ». */
  native?: boolean;
}

export interface AgenceOpeningHours {
  /** Libellé traduit des jours concernés. */
  days: AgenceOpeningDays;
  /** Format « HH:mm ». */
  opens: string;
  closes: string;
  /** Affiche la mention « sur rendez-vous ». */
  byAppointment?: boolean;
}

export type AgenceOpeningDays = 'mondayToFriday' | 'saturday' | 'sunday';

export interface AgenceHighlight {
  /** Nom d'une icône Material Symbols. */
  icon: string;
  title: string;
  text: string;
}
