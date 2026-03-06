import express from 'express';
import { loginCheck } from '../middleware/loginMiddleware.js';
import { addFavorite, getFavorites, removeFavorite } from '../controllers/favorite.controllers.js';

const router = express.Router();

router.use('/protected', loginCheck);
router.post('/protected/users/favorites', addFavorite)
router.delete('/protected/users/favorites/:clubId', removeFavorite)
router.get('/protected/users/:usersId/favorites', getFavorites)

export { router as favorites };
