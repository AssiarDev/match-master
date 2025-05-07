import express from 'express';
import { insertUser } from "../insert-db/insertUser.js";

const router = express.Router();

router.post('/register', (req, res) => {
    try {

        const { username, mail, password } = req.body;
        const user = insertUser(username, mail, password);

        if (!username || !mail || !password) {
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

export { router as register}