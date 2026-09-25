import { indexById } from '../../utils/indexById';

describe('indexById', () => {
  it('maps each id to its row', () => {
    const psg = { id: 1, name: 'PSG' };
    const om = { id: 2, name: 'OM' };

    const byId = indexById([psg, om]);

    expect(byId.get(1)).toBe(psg);
    expect(byId.get(2)).toBe(om);
  });

  it('returns undefined for an unknown id', () => {
    expect(indexById([{ id: 1 }]).get(99)).toBeUndefined();
  });

  it('returns an empty map for an empty list', () => {
    expect(indexById([]).size).toBe(0);
  });
});
