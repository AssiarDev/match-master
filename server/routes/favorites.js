import express from 'express';
import { insertUsersFavorite } from '../insert-db/insertUsersFavorite.js';
import { getUserFavorites } from '../db/queries.js';
import { loginCheck } from '../middleware/loginMiddleware.js';
import { deleteFavoriteUser } from '../delete-db/deleteFavoriteUser.js';


const router = express.Router();

router.use('/protected', loginCheck)

router.get('/protected/users/:usersId/favorites', async (req, res) => {
    try {
        const userId = parseInt(req.params.usersId, 10);

        if (isNaN(userId)) {
            return res.status(400).json({ error: "ID utilisateur invalide" });
        }

        const favorites = await getUserFavorites(userId);

        res.status(200).json(favorites);

    } catch(e){
        console.error('Une erreur est survenue', e.message)
        res.status(500).json({ error: "Erreur serveur" })
    }
});

router.post('/protected/users/favorites', async (req, res) => {
    try {
        const { userId, clubId } = req.body;

        if (!userId || !clubId) {
            return res.status(400).json({ error: "userId et clubId sont requis." });
        }

        const result = await insertUsersFavorite(userId, clubId);

        if (result.success) {
            res.status(201).json({ message: result.message });
        } else {
            res.status(500).json({ error: result.error });
        }

    } catch (e) {
        res.status(500).json({ error: "Erreur serveur." });
    }
});

router.delete('/protected/users/favorites/:clubId', async (req, res) => {
    try {
        const userId = req.user.id;
        const clubId = parseInt(req.params.clubId, 10);

        const result = await deleteFavoriteUser(userId, clubId);

        if(result.success){
            res.status(200).json({ message: result.message});
        } else {
            res.status(500).json({ error: result.error})
        }
    } catch (e){
        res.status(500).json({ error: "Une erreur est survenue."})
    }
})

export { router as favorites };
