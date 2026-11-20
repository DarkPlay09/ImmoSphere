import { Pipe, PipeTransform } from '@angular/core';

/**
 * Lien `mailto:` vers l'adresse d'une agence (UC10 « Envoyer un e-mail », KAN-152) :
 * ouvre le logiciel de messagerie de l'utilisateur avec un nouveau message adressé à l'agence.
 * Partagé par la carte de la liste et l'en-tête du profil.
 */
@Pipe({ name: 'agenceMailto', standalone: true })
export class AgenceMailtoPipe implements PipeTransform {
  transform(email: string): string {
    return toMailtoHref(email);
  }
}

/**
 * Encode l'adresse (caractères réservés comme `+`, `?`, `&`, `#`, espaces…) en gardant
 * le `@` lisible, comme le recommande la RFC 6068.
 */
export function toMailtoHref(email: string): string {
  return `mailto:${encodeURIComponent(email.trim()).replace(/%40/g, '@')}`;
}
