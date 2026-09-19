import type { Request, Response } from 'express';
import { leagueService } from '../lib/container';
import { sendServiceError } from '../utils/sendServiceError';

export const allLeagues = async (
  req: Request,
  res: Response
): Promise<void> => {
  const result = await leagueService.getAllLeague();
  if (!result.success) return sendServiceError(res, result);
  res.status(200).json(result.leagues);
};
