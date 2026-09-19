import express from 'express';
import { standingsFixtures } from '../controllers/standings.controllers';
import { validateIdParams } from '../middleware/validateIds';

const router = express.Router();

router.get('/standings/:id', validateIdParams('id'), standingsFixtures);

export { router as standings };
