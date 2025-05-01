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

        if (user.success) {
            req.session.user = { id: user.id, email: user.email, token: user.token };
            res.status(200).json({ message: "Connexion réussie.", token: user.token });
        } else {
            res.status(401).json({ error: "Identifiants incorrects." });
        }

    } catch(e){
        res.status(500).json({ error: "Erreur serveur" });
    }
});

export { router as login }