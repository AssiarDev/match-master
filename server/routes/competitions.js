import express from 'express';
import { getMatchesByDate } from '../controllers/matchesByDate.controllers.js';
import { getMatchesByTeam } from '../controllers/matchesByTeam.controllers.js';
import { getCompetitionMatches } from '../controllers/matchesByLeagues.controllers.js';
import { getTeamsOfLeague } from '../controllers/team.controllers.js';
import { allLeagues } from '../controllers/league.controllers.js';

const router = express.Router();

router.get('/competitions', allLeagues);
router.get('/competitions/:id/teams', getTeamsOfLeague);
router.get('/competitions/:id/matches', getCompetitionMatches)
router.get("/competitions/matches", getMatchesByDate)
router.get('/teams/:teamId/matches', getMatchesByTeam)

export { router as competitions };
