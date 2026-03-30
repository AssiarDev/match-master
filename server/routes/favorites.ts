import express from 'express';
import { loginCheck } from '../middleware/loginMiddleware';
import {
  addFavorite,
  getFavorites,
  removeFavorite,
} from '../controllers/favorite.controllers';

const router = express.Router();

router.use('/protected', loginCheck);
router.post('/protected/users/favorites', addFavorite);
router.delete('/protected/users/favorites/:clubId', removeFavorite);
router.get('/protected/users/:usersId/favorites', getFavorites);

export { router as favorites };
