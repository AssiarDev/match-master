import type { Request, Response } from 'express';
import { scorersService } from '../lib/container';
import { sendServiceError } from '../utils/sendServiceError';

export const topScorers = async (
  req: Request,
  res: Response
): Promise<void> => {
  const result = await scorersService.getTopScorers(Number(req.params.id));
  if (!result.success) return sendServiceError(res, result);
  res.json(result.scorers);
};
