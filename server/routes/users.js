import { insertUser } from "../insert-db/insertUser.js";
import { insertUsersFavorite } from "../insert-db/insertUsersFavorite.js";
import { getUserFavorites } from "../db/queries.js";
import express from 'express';

const router = express.Router();

router.post('/users', (req, res) => {
    try {

        const { username, email, password } = req.body;
        const user = insertUser(username, email, password);

        if (!username || !email || !password) {
            return res.status(400).json({ error: "Tous les champs sont obligatoires" });
        }

        if (user) {
            res.status(201).json({ message: "Utilisateur ajouté avec succès" });
        } else {
            res.status(409).json({ error: "L'utilisateur existe déjà" });
        }

    } catch(e){
        res.status(500).json({ error: "Erreur serveur" });
    }
});

router.post('/users/favorites', (req, res) => {
    try {
        const { userId, clubId } = req.body;

        if (!userId || !clubId) {
            return res.status(400).json({ error: "userId et clubId sont requis." });
        }

        const result = insertUsersFavorite(userId, clubId);

        if (result.success) {
            res.status(201).json({ message: result.message });
        } else {
            res.status(500).json({ error: result.error });
        }

    } catch (e) {
        res.status(500).json({ error: "Erreur serveur." });
    }
})

router.get('/users/:usersId/favorites', (req, res) => {
    try {
        const userId = parseInt(req.params.usersId, 10);

        if (isNaN(userId)) {
            return res.status(400).json({ error: "ID utilisateur invalide" });
        }

        const favorites = getUserFavorites(userId);

        res.status(200).json(favorites);

    } catch(e){
        console.error('Une erreur est survenue', e.message)
        res.status(500).json({ error: "Erreur serveur" })
    }
})

export { router as users };