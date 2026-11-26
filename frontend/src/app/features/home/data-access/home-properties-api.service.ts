import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';

import { environment } from '../../../../../environments/environments';

import { parsePebRating } from '../../../shared/properties/models/peb-rating.model';

import { BienAccueilResponseDto, HomeProperty } from './home-property.model';

@Injectable({
  providedIn: 'root',
})
export class HomePropertiesApiService {
  private readonly http = inject(HttpClient);

  private readonly apiUrl = `${environment.apiUrl}/api/accueil/biens`;

  getProperties(): Observable<HomeProperty[]> {
    return this.http.get<BienAccueilResponseDto[]>(this.apiUrl).pipe(
      map((biens) =>
        biens.flatMap((bien) => {
          const property = this.toProperty(bien);

          return property ? [property] : [];
        }),
      ),
    );
  }

  /**
   * Convertit le DTO .NET vers le modèle Property
   * déjà utilisé par les cartes Angular.
   */
  private toProperty(bien: BienAccueilResponseDto): HomeProperty | null {
    const transaction = bien.typeTransaction.trim().toLowerCase();

    // Ne pas transformer un type inconnu en "vente"
    // silencieusement.
    if (transaction !== 'vente' && transaction !== 'location') {
      return null;
    }

    return {
      id: bien.id,
      title: bien.titre,
      price: bien.prix,

      city: bien.localite,
      postalCode: bien.codePostal,

      // L'endpoint de liste ne communique
      // volontairement aucune adresse précise.
      addressVisibility: 'city-only',

      imageUrl: this.getPlaceholderImage(bien.typeBien),

      transactionType: transaction === 'vente' ? 'sale' : 'rent',

      isVisit360: bien.visite360,
      isNew: false,

      peb: parsePebRating(bien.peb),

      bedrooms: bien.nombreChambres,
      bathrooms: bien.nombreSallesDeBain,
      areaM2: bien.surfaceHabitable,
    };
  }

  /**
   * Le backend ne distribue pas encore les
   * photographies des biens.
   *
   * Images locales illustratives, en attendant
   * une vraie URL fournie par l'API.
   */
  private getPlaceholderImage(typeBien: string): string {
    const type = typeBien.trim().toLowerCase();

    if (type.includes('villa')) {
      return '/images/home/selections/villa.png';
    }

    if (type.includes('maison')) {
      return '/images/home/selections/maison.png';
    }

    if (type.includes('duplex')) {
      return '/images/home/selections/duplex.png';
    }

    return '/images/home/selections/appartement.png';
  }

}
