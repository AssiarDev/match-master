import type { Request, Response, NextFunction } from 'express';
import { isBlacklisted } from '../lib/tokenBlacklist';
import { verifyToken } from '../lib/session';
import { MESSAGES } from '../constants/messages';

export const loginCheck = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const token = req.cookies.token;

  if (!token) {
    res
      .status(401)
      .json({ redirect: '/login', message: MESSAGES.auth.tokenMissing });
    return;
  }

  if (isBlacklisted(token)) {
    res.status(401).json({ error: MESSAGES.auth.tokenRevoked });
    return;
  }

  try {
    req.user = verifyToken(token);
    next();
  } catch (error) {
    res.status(403).json({ message: MESSAGES.auth.tokenInvalid });
    return;
  }
};
