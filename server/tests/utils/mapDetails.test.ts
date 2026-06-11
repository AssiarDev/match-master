import { mapDetails } from '../../utils/mapDetails';

describe('mapDetails', () => {
  it('retourne toutes les stats quand les 6 codes sont présents', () => {
    const result = mapDetails([
      { type: { code: 'overall-matches-played' }, value: 10 },
      { type: { code: 'overall-won' }, value: 6 },
      { type: { code: 'overall-draw' }, value: 2 },
      { type: { code: 'overall-lost' }, value: 2 },
      { type: { code: 'overall-goals-for' }, value: 18 },
      { type: { code: 'overall-goals-against' }, value: 9 },
    ]);

    expect(result).toEqual({
      played: 10,
      won: 6,
      draw: 2,
      lost: 2,
      goals_for: 18,
      goals_against: 9,
      goal_diff: 9,
    });
  });

  it('retourne un objet vide avec goal_diff à 0 si le tableau est vide', () => {
    const result = mapDetails([]);

    expect(result).toEqual({ goal_diff: 0 });
  });

  it('ignore les codes inconnus et ne les ajoute pas aux stats', () => {
    const result = mapDetails([{ type: { code: 'unknown-code' }, value: 99 }]);

    expect(result).toEqual({ goal_diff: 0 });
  });
});
