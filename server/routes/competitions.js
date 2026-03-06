import express from 'express';
import { getCompetitionsIds } from '../service/database/competitionsServices.js';
import { getAllLeagues } from '../service/database/competitionsServices.js';
import { getMatchesByDate } from '../controllers/matchesByDate.controllers.js';
import { getMatchesByTeam } from '../controllers/matchesByTeam.controllers.js';
import { getCompetitionMatches } from '../controllers/matchesByLeagues.controllers.js';
import { getTeamsOfLeague } from '../controllers/team.controllers.js';

const router = express.Router();

router.get('/competitions', async (req, res) => {
  try {
    const competitions = await getAllLeagues();

    res.json(competitions);
  } catch (e) {
    console.log("Erreur lors de l'execution de la requête :", e.message);
    res.status(500).send('Erreur serveur');
  }
});
router.get('/competitions/:id/teams', getTeamsOfLeague);
router.get('/competitions/:id/matches', getCompetitionMatches)
router.get('/competitionsId', async (req, res) => {
  try {
    const competitionIds = await getCompetitionsIds();

    res.json(competitionIds);
  } catch (e) {
    console.error('Erreur lors de la récupération des IDs', e.message);
    res.status(500).send('Error fetching data');
  }
});
router.get("/competitions/matches", getMatchesByDate)
router.get('/teams/:teamId/matches', getMatchesByTeam)

export { router as competitions };
