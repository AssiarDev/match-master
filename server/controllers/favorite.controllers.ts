import type { Request, Response } from 'express';
import { FavoriteService } from '../service/favoriteService';

const favoriteService = new FavoriteService();

export const addFavorite = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId, clubId } = req.body;
    if (!userId || !clubId) {
      res.status(400).json({ error: 'userId et clubId sont requis.' });
      return;
    }
    const result = await favoriteService.addFavorite(userId, clubId);
    if (result.success) res.status(201).json({ message: result.message });
    else res.status(500).json({ error: result.message });
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur.' });
  }
};

export const removeFavorite = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const clubId = parseInt(req.params.clubId, 10);
    const result = await favoriteService.removeFavorite(userId, clubId);
    if (result.success) res.status(200).json({ message: result.message });
    else res.status(500).json({ error: result.message });
  } catch (err) {
    res.status(500).json({ error: 'Une erreur est survenue.' });
  }
};

export const getFavorites = async (req: Request, res: Response): Promise<void> => {
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
