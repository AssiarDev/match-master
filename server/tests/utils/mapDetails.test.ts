import { mapDetails } from '../../utils/mapDetails';

describe('mapDetails', () => {
  it('returns every stat when the 6 codes are present', () => {
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

  it('returns only goal_diff at 0 for an empty list', () => {
    const result = mapDetails([]);

    expect(result).toEqual({ goal_diff: 0 });
  });

  it('ignores unknown codes', () => {
    const result = mapDetails([{ type: { code: 'unknown-code' }, value: 99 }]);

    expect(result).toEqual({ goal_diff: 0 });
  });

  it('counts a missing goal total as 0 in goal_diff', () => {
    const result = mapDetails([
      { type: { code: 'overall-goals-for' }, value: 4 },
    ]);

    expect(result).toEqual({ goals_for: 4, goal_diff: 4 });
  });
});
