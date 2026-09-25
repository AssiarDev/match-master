import type { Request, Response, NextFunction } from 'express';
import { isBlacklisted } from '../lib/tokenBlacklist';
import { verifyToken } from '../lib/session';

export const loginCheck = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const token = req.cookies.token;

  if (!token) {
    res
      .status(401)
      .json({ redirect: '/login', message: 'Accès refusé. Token absent.' });
    return;
  }

  if (isBlacklisted(token)) {
    res.status(401).json({ error: 'Token invalide' });
    return;
  }

  try {
    req.user = verifyToken(token);
    next();
  } catch (error) {
    res.status(403).json({ message: 'Token invalide ou expiré.' });
    return;
  }
};
