import express from 'express';
import { getTeamsOfLeague } from '../controllers/team.controllers.js';
import { allLeagues } from '../controllers/league.controllers.js';
import { leaguesMatches, matchByDate, matchesByTeam } from '../controllers/matches.controllers.js';

const router = express.Router();

router.get('/competitions', allLeagues);
router.get('/competitions/:id/teams', getTeamsOfLeague);
router.get('/competitions/:id/matches', leaguesMatches)
router.get("/competitions/matches", matchByDate)
router.get('/teams/:teamId/matches', matchesByTeam)

export { router as competitions };
