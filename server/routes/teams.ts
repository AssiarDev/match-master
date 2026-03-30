import express from 'express';
import { getAllTeams, getTeamId } from '../controllers/team.controllers';

const router = express.Router();

router.get('/teams', getAllTeams);
router.get('/teams/:id', getTeamId);

export { router as teams };
