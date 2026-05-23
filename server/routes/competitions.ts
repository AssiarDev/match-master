import express from 'express';
import { getTeamsOfLeague } from '../controllers/team.controllers';
import { allLeagues } from '../controllers/league.controllers';
import {
  leaguesMatches,
  liveMatches,
  matchByDate,
  matchesByTeam,
  liveMatchesUpdate,
} from '../controllers/matches.controllers';

const router = express.Router();

router.get('/competitions', allLeagues);
router.get('/competitions/:id/teams', getTeamsOfLeague);
router.get('/competitions/matches', matchByDate);
router.get('/competitions/:id/matches', leaguesMatches);
router.get('/teams/:teamId/matches', matchesByTeam);
router.get('/matches/live', liveMatches);
router.get('/matches/live/stream', liveMatchesUpdate);

export { router as competitions };
