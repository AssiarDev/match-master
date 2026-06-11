import { addToBlacklist, isBlacklisted } from '../../lib/tokenBlacklist';

describe('addTokenBlacklist', () => {
  it("Retourne false s'il n'y a pas de token", () => {
    const result = addToBlacklist('');
    expect(result).toEqual(false);
  });

  it('Retourne true si le token à déjà été blacklisté', () => {
    const result = addToBlacklist('test-token-1');
    expect(result).toEqual(true);
  });

  it('Retourne false si le token ajouter est différent de celui qui est vérifié', () => {
    const result = isBlacklisted('test-token-2');
    expect(result).toEqual(false);
  });
});
