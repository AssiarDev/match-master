import { validatePassword } from '../../utils/validatePassword';

describe('validatePassword', () => {
  it('Retourne une erreur si le mot de passe ne contient pas minimum 8 caractères', () => {
    const result = validatePassword('1234');

    expect(result).toEqual('Minimum 8 caractères');
  });

  it('Retourne une erreur si le mot de passe ne contient pas majuscule', () => {
    const result = validatePassword('raissa1234');

    expect(result).toEqual('Minimum une majuscule requise');
  });

  it('Retourne une erreur si le mot de passe ne contient pas un chiffre requis', () => {
    const result = validatePassword('Psgenforce');

    expect(result).toEqual('Minimum un chiffre requis');
  });

  it('Retourne une erreur si le mot de passe ne contient pas de caractère spécial', () => {
    const result = validatePassword('Psgenforce1234');

    expect(result).toEqual('Minimum un caractère spéciale requis');
  });

  it('Le mot de passe est valide', () => {
    const result = validatePassword('Psgenforce1234!');

    expect(result).toEqual(null);
  });
});
