import type { Request, Response } from 'express';
import { favoriteService } from '../lib/container';
import { sendServiceError } from '../utils/sendServiceError';

export const addFavorite = async (
  req: Request,
  res: Response
): Promise<void> => {
  const result = await favoriteService.addFavorite(
    req.user!.id,
    req.body.clubId
  );
  if (!result.success) return sendServiceError(res, result);
  res.status(201).json({ message: result.message });
};

export const removeFavorite = async (
  req: Request,
  res: Response
): Promise<void> => {
  const result = await favoriteService.removeFavorite(
    req.user!.id,
    Number(req.params.clubId)
  );
  if (!result.success) return sendServiceError(res, result);
  res.status(200).json({ message: result.message });
};

export const getFavorites = async (
  req: Request,
  res: Response
): Promise<void> => {
  const userId = Number(req.params.userId);
  if (userId !== req.user!.id) {
    res.status(403).json({ error: 'Action non autorisée' });
    return;
  }

  const result = await favoriteService.getFavorite(userId);
  if (!result.success) return sendServiceError(res, result);
  res.status(200).json(result.favorites);
};

export const addLeagueFavorite = async (
  req: Request,
  res: Response
): Promise<void> => {
  const result = await favoriteService.addLeagueFavorite(
    req.user!.id,
    req.body.leagueId
  );
  if (!result.success) return sendServiceError(res, result);
  res.status(201).json({ message: result.message });
};

export const removeLeagueFavorite = async (
  req: Request,
  res: Response
): Promise<void> => {
  const result = await favoriteService.removeLeagueFavorite(
    req.user!.id,
    Number(req.params.leagueId)
  );
  if (!result.success) return sendServiceError(res, result);
  res.status(200).json({ message: result.message });
};

export const getLeagueFavorites = async (
  req: Request,
  res: Response
): Promise<void> => {
  const userId = Number(req.params.userId);
  if (userId !== req.user!.id) {
    res.status(403).json({ error: 'Action non autorisée' });
    return;
  }

  const result = await favoriteService.getLeagueFavorite(userId);
  if (!result.success) return sendServiceError(res, result);
  res.status(200).json(result.favorites);
};
