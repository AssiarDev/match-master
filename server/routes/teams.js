import express from 'express';
import {
  getAllTeams,
  getTeamsById,
} from '../service/database/teamsServices.js';
import { getTeamId } from '../controllers/teamId.controllers.js';

const router = express.Router();

router.get('/teams', async (req, res) => {
  try {
    const teams = await getAllTeams();
    res.json(teams);
  } catch (e) {
    console.error("Erreur lors de l'exécution de la requête :", e.message);
    res.status(500).send('Erreur serveur');
  }
});

router.get('/teams/:id', getTeamId);

export { router as teams };
