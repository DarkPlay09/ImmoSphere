import { Property } from '../../../shared/properties/models/property.model';

/**
 * Format JSON renvoyé par GET /api/accueil/biens.
 *
 * ASP.NET Core transforme les noms des propriétés
 * C# PascalCase en camelCase dans le JSON.
 */
export interface BienAccueilResponseDto {
  id: number;
  titre: string;
  prix: number;

  localite: string;
  codePostal: string;

  typeBien: string;
  typeTransaction: string;

  peb: string | null;

  nombreChambres: number;
  nombreSallesDeBain: number;
  surfaceHabitable: number;

  visite360: boolean;
}

/**
 * Modèle utilisé par la section des dernières annonces.
 *
 * On réutilise Property sans changer l'interface
 * utilisée par les autres composants Angular.
 */
export interface HomeProperty extends Property {
  isNew: boolean;
}
