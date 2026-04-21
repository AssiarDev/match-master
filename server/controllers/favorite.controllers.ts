import type { Request, Response } from 'express';
import { favoriteService } from '../lib/container';

export const addFavorite = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user!.id;
    const { clubId } = req.body;
    if (!clubId) {
      res.status(400).json({ error: 'clubId est requis.' });
      return;
    }
    const result = await favoriteService.addFavorite(userId, clubId);
    if (result.success) res.status(201).json({ message: result.message });
    else res.status(500).json({ error: result.message });
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur.' });
  }
};

export const removeFavorite = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user!.id;
    const clubId = parseInt(req.params.clubId, 10);
    if (isNaN(clubId)) {
      res.status(400).json({ error: 'clubId invalide' });
      return;
    }
    const result = await favoriteService.removeFavorite(userId, clubId);
    if (result.success) res.status(200).json({ message: result.message });
    else res.status(500).json({ error: result.message });
  } catch (err) {
    res.status(500).json({ error: 'Une erreur est survenue.' });
  }
};

export const getFavorites = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = parseInt(req.params.usersId, 10);
    if (isNaN(userId)) {
      res.status(400).json({ error: 'ID utilisateur invalide' });
      return;
    }
    const favorites = await favoriteService.getFavorite(userId);
    res.status(200).json(favorites);
  } catch (err) {
    console.error('Une erreur est survenue', (err as Error).message);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

export const addLeagueFavorite = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user!.id
    const { leagueId } = req.body

    if (isNaN(leagueId)){
      res.status(400).json({ error: 'ID de la ligue invalide' })
      return;
    }

    const result = await favoriteService.addLeagueFavorite(userId, leagueId)
    result.success ? res.status(201).json({ message: result.message }) : res.status(500).json({ message: result.message })

  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur.' });
  }
}

export const removeLeagueFavorite = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
  const userId = req.user!.id
  const leagueId = parseInt(req.params.leagueId, 10)

  if (isNaN(leagueId)) {
    res.status(400).json({ error: 'LeagueId invalide' });
    return;
  }

  const result = await favoriteService.removeLeagueFavorite(userId, leagueId)
  result.success ? res.status(200).json({ message: result.message }) : res.status(500).json({ message: result.message })

  } catch (err) {
    res.status(500).json({ error: 'Une erreur est survenue.' });
  }

}

export const getLeagueFavorites = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = parseInt(req.params.userId, 10);

    if (isNaN(userId)) {
      res.status(400).json({ error: 'ID utilisateur invalide' });
      return;
    }
    const favorites = await favoriteService.getLeagueFavorite(userId);
    res.status(200).json(favorites);

  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
};
