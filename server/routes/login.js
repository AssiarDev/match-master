import express from 'express';
import { login } from '../db/queries.js';

const router = express.Router();

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await login(email, password);

        if (!email || !password) {
            return res.status(400).json({ error: "Tous les champs sont obligatoires" });
        }

        if (user) {
            res.status(201).json({ message: "Connexion effectué avec succès.", token : user.token });
        } else {
            res.status(409).json({ error: user.message || "Echec lors de la connexion" });
        }
    } catch(e){
        res.status(500).json({ error: "Erreur serveur" });
    }
});

export { router as login }