import { DEFAULT_AGENCE_SEARCH } from '../models/agence-search.model';
import { MOCK_AGENCES } from './agences.mock';
import { searchAgences } from './agences-mock-search';

describe('searchAgences', () => {
  it('renvoie la première page de 6 agences et le total', () => {
    const result = searchAgences(MOCK_AGENCES, DEFAULT_AGENCE_SEARCH);

    expect(result.items).toHaveLength(6);
    expect(result.total).toBe(MOCK_AGENCES.length);
    expect(result.page).toBe(1);
    expect(result.pageCount).toBe(2);
  });

  it('renvoie la dernière page incomplète', () => {
    const result = searchAgences(MOCK_AGENCES, { ...DEFAULT_AGENCE_SEARCH, page: 2 });

    expect(result.items).toHaveLength(MOCK_AGENCES.length - 6);
  });

  it('ramène une page hors bornes dans les limites', () => {
    expect(searchAgences(MOCK_AGENCES, { ...DEFAULT_AGENCE_SEARCH, page: 99 }).page).toBe(2);
    expect(searchAgences(MOCK_AGENCES, { ...DEFAULT_AGENCE_SEARCH, page: 0 }).page).toBe(1);
  });

  it('filtre par nom sans tenir compte de la casse ni des accents', () => {
    const result = searchAgences(MOCK_AGENCES, { ...DEFAULT_AGENCE_SEARCH, name: 'horizon immo liege' });

    expect(result.items.map((agence) => agence.name)).toEqual(['Horizon Immo Liège']);
  });

  it('filtre par ville ou par code postal', () => {
    const byCity = searchAgences(MOCK_AGENCES, { ...DEFAULT_AGENCE_SEARCH, location: 'bruxelles' });
    const byPostalCode = searchAgences(MOCK_AGENCES, { ...DEFAULT_AGENCE_SEARCH, location: '4000' });
    const both = searchAgences(MOCK_AGENCES, { ...DEFAULT_AGENCE_SEARCH, location: 'Liège, 4000' });

    expect(byCity.total).toBe(2);
    expect(byPostalCode.items.map((agence) => agence.id)).toEqual([1]);
    expect(both.items.map((agence) => agence.id)).toEqual([1]);
  });

  it('filtre par région', () => {
    const result = searchAgences(MOCK_AGENCES, { ...DEFAULT_AGENCE_SEARCH, region: 'flanders' });

    expect(result.total).toBeGreaterThan(0);
    expect(result.items.every((agence) => agence.region === 'flanders')).toBe(true);
  });

  it('renvoie une liste vide si rien ne correspond', () => {
    const result = searchAgences(MOCK_AGENCES, { ...DEFAULT_AGENCE_SEARCH, name: 'introuvable' });

    expect(result).toEqual({ items: [], total: 0, page: 1, pageCount: 1 });
  });

  it('trie par nom', () => {
    const names = searchAgences(MOCK_AGENCES, { ...DEFAULT_AGENCE_SEARCH, sort: 'name', pageSize: 100 }).items.map(
      (agence) => agence.name,
    );

    expect(names).toEqual([...names].sort((a, b) => a.localeCompare(b, 'fr', { sensitivity: 'base' })));
  });

  it('trie par note décroissante, agences sans note en dernier', () => {
    const items = searchAgences(MOCK_AGENCES, { ...DEFAULT_AGENCE_SEARCH, sort: 'rating', pageSize: 100 }).items;

    expect(items[0]?.rating).toBe(4.9);
    expect(items.at(-1)?.rating).toBeUndefined();
  });

  it('garde l’ordre de la source pour la pertinence', () => {
    const ids = searchAgences(MOCK_AGENCES, { ...DEFAULT_AGENCE_SEARCH, pageSize: 100 }).items.map((agence) => agence.id);

    expect(ids).toEqual(MOCK_AGENCES.map((agence) => agence.id));
  });

  it('garde une agence sans région pour « toutes les régions » et l’exclut d’une région précise', () => {
    const sansRegion = { ...MOCK_AGENCES[0]!, id: 99, region: undefined };
    const agences = [...MOCK_AGENCES, sansRegion];

    expect(searchAgences(agences, { ...DEFAULT_AGENCE_SEARCH, pageSize: 100 }).items).toContain(sansRegion);
    expect(searchAgences(agences, { ...DEFAULT_AGENCE_SEARCH, region: 'wallonia', pageSize: 100 }).items).not.toContain(
      sansRegion,
    );
  });
});
