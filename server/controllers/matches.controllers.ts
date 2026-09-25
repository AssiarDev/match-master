import type { Request, Response } from 'express';
import { matchesService } from '../lib/container';
import { liveMatchesBroadcaster } from '../lib/container';
import { sendServiceError } from '../utils/sendServiceError';
import { MESSAGES } from '../constants/messages';

export const matchByDate = async (
  req: Request,
  res: Response
): Promise<void> => {
  const date = req.query.date as string | undefined;
  if (!date) {
    res.status(400).json({ error: MESSAGES.matches.dateRequired });
    return;
  }
  const result = await matchesService.getMatchesByDate(date);
  if (!result.success) return sendServiceError(res, result);
  res.json({ data: result.matches });
};

export const leaguesMatches = async (
  req: Request,
  res: Response
): Promise<void> => {
  const result = await matchesService.getLeagueMatches(Number(req.params.id));
  if (!result.success) return sendServiceError(res, result);
  res.json(result.matches);
};

export const matchesByTeam = async (
  req: Request,
  res: Response
): Promise<void> => {
  const result = await matchesService.getMatchesByTeam(
    Number(req.params.teamId)
  );
  if (!result.success) return sendServiceError(res, result);
  res.json({ data: result.matches });
};

export const liveMatches = async (
  req: Request,
  res: Response
): Promise<void> => {
  const result = await matchesService.getLiveMatches();
  if (!result.success) return sendServiceError(res, result);
  res.json({ data: result.matches });
};

export const liveMatchesUpdate = (req: Request, res: Response) => {
  liveMatchesBroadcaster.addClient(req, res);
};
