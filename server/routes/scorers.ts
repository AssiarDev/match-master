import express from 'express';
import { topScorers } from '../controllers/scorers.controllers';

const router = express.Router();

router.get('/scorers/:id', topScorers);

export { router as scorers };
