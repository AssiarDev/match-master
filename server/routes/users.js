import { deleteUsers, getAllUsers, updateUsers } from "../db/queries.js";
import express from 'express';
import { loginCheck } from '../middleware/loginMiddleware.js'

const router = express.Router();

router.get('/users', (req, res) => {
    try {
        const users = getAllUsers();
        if(!users){
            return res.status(500).json({error: "Impossible de récupérer tous les utilisateurs."})
        }

        res.json(users)
    } catch(e){
        res.status(500).json({ error: "Erreur serveur" })
    }
})

router.delete('/users/:id', (req, res) => {
    try {
        const id = parseInt(req.params.id, 10)

        if (isNaN(id)) {
            return res.status(400).json({ error: "ID invalide" });
        }
        const result = deleteUsers(id);
        
        if (result) {
            return res.json({ message: "Utilisateur supprimé avec succès" });
        } else {
            return res.status(404).json({ error: "Utilisateur introuvable" });
        }

    } catch (e){
        res.status(500).json({ error: "Erreur serveur" })
    }
});

router.put('/users/:id', (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        const { username, email } = req.body;

        if(!username || !email){
            return res.status(400).json({ error: "Tous les champs sont obligatoires" })
        };

        const result = updateUsers(id, {username, email})

        if (result.error) {
            return res.status(404).json(result);
        }

        res.json(result);

    } catch (e){
        res.status(500).json({ error: "Erreur serveur" })
    }
})

router.get('/user/profile', loginCheck, (req, res) => {
    res.json({ isAuthenticated: true, user: req.user });
})

export { router as users };