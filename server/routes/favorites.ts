import express from 'express';
import { loginCheck } from '../middleware/loginMiddleware';
import {
  addFavorite,
  listFavorites,
  removeFavorite,
} from '../controllers/favorite.controllers';
import { validateIdBody, validateIdParams } from '../middleware/validateIds';
import { requireSelf } from '../middleware/requireSelf';

const router = express.Router();

router.use('/protected', loginCheck);
/** équipes */
router.post(
  '/protected/users/favorites',
  validateIdBody('clubId'),
  addFavorite('team', 'clubId')
);
router.delete(
  '/protected/users/favorites/:clubId',
  validateIdParams('clubId'),
  removeFavorite('team', 'clubId')
);
router.get(
  '/protected/users/:userId/favorites',
  validateIdParams('userId'),
  requireSelf('userId'),
  listFavorites('team')
);

/** Ligues */
router.get(
  '/protected/users/:userId/favorites-leagues',
  validateIdParams('userId'),
  requireSelf('userId'),
  listFavorites('competition')
);
router.post(
  '/protected/users/favorites-leagues',
  validateIdBody('leagueId'),
  addFavorite('competition', 'leagueId')
);
router.delete(
  '/protected/users/favorites-leagues/:leagueId',
  validateIdParams('leagueId'),
  removeFavorite('competition', 'leagueId')
);

export { router as favorites };
