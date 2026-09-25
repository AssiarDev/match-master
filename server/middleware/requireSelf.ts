import type { NextFunction, Request, Response } from 'express';
import { MESSAGES } from '../constants/messages';

/**
 * Rejects the request with a 403 unless the authenticated user is the one
 * targeted by the route, so that a user can only act on their own account.
 * Must run after loginCheck (which sets req.user) and validateIdParams
 * (which guarantees the param is a valid number).
 * @param param - The route param holding the targeted user id, e.g. 'id'
 */
export const requireSelf =
  (param: string) =>
  (req: Request, res: Response, next: NextFunction): void => {
    if (req.user?.id !== Number(req.params[param])) {
      res.status(403).json({ error: MESSAGES.common.forbidden });
      return;
    }
    next();
  };
