import express from 'express';
import { topScorers } from '../controllers/scorers.controllers.js';

const router = express.Router();

router.get('/scorers/:id', topScorers);

export { router as scorers };
