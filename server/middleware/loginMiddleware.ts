import jwt from 'jsonwebtoken';
import type { Request, Response, NextFunction } from 'express';
import type { UserPayload } from '../types/express';

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

  try {
    const decoded = jwt.verify(
      token,
      process.env.SECRET_KEY as string
    ) as UserPayload;
    req.user = decoded;
    next();
  } catch (error) {
    res.status(403).json({ message: 'Token invalide ou expiré.' });
    return;
  }
};
