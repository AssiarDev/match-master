import { FavoriteService } from "../service/favoriteService.js";

const favoriteService = new FavoriteService()

export const addFavorite = async (req, res) => {
    try {
        const { userId, clubId } = req.body;

        if (!userId || !clubId) {
            return res.status(400).json({ error: 'userId et clubId sont requis.' });
        }

        const result = await favoriteService.addFavorite(userId, clubId)

        if (result.success) {
            res.status(201).json({ message: result.message });
        } else {
            res.status(500).json({ error: result.error });
        }
    } catch (err){
        res.status(500).json({ error: 'Erreur serveur.' });
    }
}

export const removeFavorite = async (req, res) => {
    try {
        const userId = req.user.id;
        const clubId = parseInt(req.params.clubId, 10);

        const result = await favoriteService.removeFavorite(userId, clubId)

        if (result.success) {
            res.status(200).json({ message: result.message });
        } else {
            res.status(500).json({ error: result.error });
        }

    } catch (err){
        res.status(500).json({ error: 'Une erreur est survenue.' });
    }
}

export const getFavorites = async (req, res) => {
    try {
        const userId = parseInt(req.params.usersId, 10);

        if (isNaN(userId)) {
            return res.status(400).json({ error: 'ID utilisateur invalide' });
        }

        const favorites = await favoriteService.getFavorite(userId)

        res.status(200).json(favorites)
    } catch(err){
        console.error('Une erreur est survenue', e.message);
        res.status(500).json({ error: 'Erreur serveur' });
    }
}