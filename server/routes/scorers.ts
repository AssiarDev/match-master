import express from 'express';
import { topScorers } from '../controllers/scorers.controllers';
import { validateIdParams } from '../middleware/validateIds';

const router = express.Router();

router.get('/scorers/:id', validateIdParams('id'), topScorers);

export { router as scorers };
