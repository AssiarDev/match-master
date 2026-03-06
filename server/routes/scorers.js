import express from 'express';
import { getTopScorers } from '../controllers/topScorersBySeason.controllers.js';

const router = express.Router();

router.get('/scorers/:id', getTopScorers);

export { router as scorers };
