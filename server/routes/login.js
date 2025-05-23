import express from 'express';
import { login } from '../db/queries.js';

const router = express.Router();

router.post('/login', async (req, res) => {
    try {
        const { mail, password } = req.body;
        const user = await login(mail, password);

        if (!mail || !password) {
            return res.status(400).json({ error: "Tous les champs sont obligatoires" });
        }

        if (user.success) {
            req.session.user = { id: user.id, mail: user.mail, token: user.token };

            // **Envoyer le token dans un cookie sécurisé**
            res.cookie("token", user.token, {
                httpOnly: true, 
                secure: true,
                sameSite: "None" 
            });
            
            res.status(200).json({ message: "Connexion réussie.", token: user.token });
        } else {
            res.status(401).json({ error: "Identifiants incorrects." });
        }

    } catch(e){
        res.status(500).json({ error: "Erreur serveur" });
    }
});

export { router as login }