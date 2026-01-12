import express from "express";
import { getAllTeams, getTeamsById } from "../service/database/teamsServices.js";

const router = express.Router();

router.get('/teams', async (req, res) => {
    try{
        const teams = await getAllTeams()
        res.json(teams);

    }catch(e){
        console.error('Erreur lors de l\'exécution de la requête :', e.message);
        res.status(500).send('Erreur serveur');
    }
});

router.get('/teams/:id', async (req, res) => {
    const teamId = parseInt(req.params.id);

    if (isNaN(teamId)) {
        return res.status(400).json({ error: "L'ID de l'équipe est invalide." });
    }

    try {
        const team = await getTeamsById(teamId)
        res.json(team);

    } catch (err) {
        console.error('Erreur lors de la récupération des détails de l\'équipe :', err.message);
        res.status(500).send('Erreur serveur');
    }
});


export {router as teams};

