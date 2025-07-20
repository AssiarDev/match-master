import { deleteUsers, getAllUsers, updateUsers } from "../db/queries.js";
import express from 'express';
import { loginCheck } from '../middleware/loginMiddleware.js'

const router = express.Router();

router.get('/users', async (req, res) => {
    try {
        const users = await getAllUsers();
        
        if(!users){
            return res.status(500).json({error: "Impossible de récupérer tous les utilisateurs."})
        }
        console.log('users :', users)
        res.json(users)
    } catch(e){
        res.status(500).json({ error: "Erreur serveur" })
    }
})

router.delete('/users/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10)

        if (isNaN(id)) {
            return res.status(400).json({ error: "ID invalide" });
        }
        const result = await deleteUsers(id);
        
        if (result) {
            return res.json({ message: "Utilisateur supprimé avec succès" });
        } else {
            return res.status(404).json({ error: "Utilisateur introuvable" });
        }

    } catch (e){
        res.status(500).json({ error: "Erreur serveur" })
    }
});

router.put('/users/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        const { username, email } = req.body;

        if(!username || !email){
            return res.status(400).json({ error: "Tous les champs sont obligatoires" })
        };

        const result = await updateUsers(id, {username, email})

        if (result.error) {
            return res.status(404).json(result);
        }

        res.json(result);

    } catch (e){
        res.status(500).json({ error: "Erreur serveur" })
    }
})

router.get('/user/profile', loginCheck, (req, res) => {
    if (!req.user) {
        return res.status(401).json({ isAuthenticated: false, message: "Non authentifié" });
    }

    res.json({ 
        isAuthenticated: true, 
        user: {
            id: req.user.id,
            mail: req.user.mail,
            username: req.user.username
    } });
})

export { router as users };