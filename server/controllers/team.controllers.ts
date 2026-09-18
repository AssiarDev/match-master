import type { Request, Response } from 'express';
import { teamService } from '../lib/container';
import { sendServiceError } from '../utils/sendServiceError';

export const getAllTeams = async (
  req: Request,
  res: Response
): Promise<void> => {
  const result = await teamService.allTeams();
  if (!result.success) return sendServiceError(res, result);
  res.json(result.teams);
};

export const getTeamId = async (req: Request, res: Response): Promise<void> => {
  const result = await teamService.teamById(Number(req.params.id));
  if (!result.success) return sendServiceError(res, result);
  res.json(result.team);
};

export const getTeamsOfLeague = async (
  req: Request,
  res: Response
): Promise<void> => {
  const result = await teamService.teamByLeague(Number(req.params.id));
  if (!result.success) return sendServiceError(res, result);
  res.json(result.teams);
};
