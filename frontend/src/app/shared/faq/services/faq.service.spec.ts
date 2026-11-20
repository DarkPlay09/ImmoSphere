import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';

import { MOCK_FAQ_QUESTIONS } from '../data/faq.mock';
import { FaqService } from './faq.service';

describe('FaqService', () => {
  let service: FaqService;

  beforeEach(() => {
    service = TestBed.inject(FaqService);
  });

  it('renvoie toutes les questions, dans l’ordre, sans recherche', async () => {
    expect(await firstValueFrom(service.search('   '))).toEqual(MOCK_FAQ_QUESTIONS);
  });

  it('cherche sans tenir compte de la casse ni des accents', async () => {
    const result = await firstValueFrom(service.search('REINITIALISER'));

    expect(result.map((item) => item.question)).toEqual(['Comment réinitialiser mon mot de passe ?']);
  });

  it('cherche aussi dans les réponses', async () => {
    const result = await firstValueFrom(service.search('brouillon'));

    expect(result.map((item) => item.id)).toEqual([8]);
  });

  it('renvoie une liste vide quand rien ne correspond', async () => {
    expect(await firstValueFrom(service.search('hypothèque inversée'))).toEqual([]);
  });
});
