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

const router = express.Router();

router.use('/protected', loginCheck);
/** équipes */
router.post('/protected/users/favorites', addFavorite);
router.delete('/protected/users/favorites/:clubId', removeFavorite);
router.get('/protected/users/:usersId/favorites', getFavorites);

/** Ligues */
router.get('/protected/users/:userId/favorites-leagues', getLeagueFavorites)
router.post('/protected/users/favorites-leagues', addLeagueFavorite)
router.delete('/protected/users/favorites-leagues/:leagueId', removeLeagueFavorite)

export { router as favorites };
