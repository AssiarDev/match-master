import type { Request, Response } from 'express';
import { standingService } from '../lib/container';
import { sendServiceError } from '../utils/sendServiceError';

export const standingsFixtures = async (
  req: Request,
  res: Response
): Promise<void> => {
  const result = await standingService.getStandingFixtures(
    Number(req.params.id)
  );
  if (!result.success) return sendServiceError(res, result);
  res.json(result.standing);
};
