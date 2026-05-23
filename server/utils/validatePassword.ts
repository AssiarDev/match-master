export const validatePassword = (password: string): string | null => {
  if (password.length < 8) return 'Minimum 8 caractères';
  if (!/[A-Z]/.test(password)) return 'Minimum une majuscule requise';
  if (!/[0-9]/.test(password)) return 'Minimum un chiffre requis';
  if (!/[^a-zA-Z0-9]/.test(password))
    return 'Minimum un caractère spéciale requis';

  return null;
};
