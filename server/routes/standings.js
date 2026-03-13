import express from 'express';
import { standingsFixtures } from '../controllers/standings.controllers.js';

const router = express.Router();

router.get('/standings/:id', standingsFixtures);

export { router as standings };
