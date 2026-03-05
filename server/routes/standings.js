import express from 'express';
import { getStandings } from '../controllers/standingsBySeason.controllers.js';

const router = express.Router();

router.get('/standings/:id', getStandings);

export { router as standings };
