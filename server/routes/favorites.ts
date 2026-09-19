import express from 'express';
import { loginCheck } from '../middleware/loginMiddleware';
import {
  addFavorite,
  addLeagueFavorite,
  getFavorites,
  getLeagueFavorites,
  removeFavorite,
  removeLeagueFavorite,
} from '../controllers/favorite.controllers';
import { validateIdBody, validateIdParams } from '../middleware/validateIds';

const router = express.Router();

router.use('/protected', loginCheck);
/** équipes */
router.post(
  '/protected/users/favorites',
  validateIdBody('clubId'),
  addFavorite
);
router.delete(
  '/protected/users/favorites/:clubId',
  validateIdParams('clubId'),
  removeFavorite
);
router.get(
  '/protected/users/:userId/favorites',
  validateIdParams('userId'),
  getFavorites
);

/** Ligues */
router.get(
  '/protected/users/:userId/favorites-leagues',
  validateIdParams('userId'),
  getLeagueFavorites
);
router.post(
  '/protected/users/favorites-leagues',
  validateIdBody('leagueId'),
  addLeagueFavorite
);
router.delete(
  '/protected/users/favorites-leagues/:leagueId',
  validateIdParams('leagueId'),
  removeLeagueFavorite
);

export { router as favorites };
