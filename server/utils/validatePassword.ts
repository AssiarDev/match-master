import { MESSAGES } from '../constants/messages';

export const validatePassword = (password: string): string | null => {
  if (password.length < 8) return MESSAGES.password.tooShort;
  if (!/[A-Z]/.test(password)) return MESSAGES.password.missingUppercase;
  if (!/[0-9]/.test(password)) return MESSAGES.password.missingDigit;
  if (!/[^a-zA-Z0-9]/.test(password)) return MESSAGES.password.missingSpecial;

  return null;
};
