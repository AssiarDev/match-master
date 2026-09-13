import express from 'express';
import { loginCheck } from '../middleware/loginMiddleware';
import {
  // getUsers,
  deleteUser,
  updateUser,
  userProfile,
  logout,
  login,
  register,
} from '../controllers/user.controllers';

const router = express.Router();

// Disabled: public route exposing every user's email. Protect it before re-enabling.
// router.get('/users', getUsers);
router.post('/register', register);
router.post('/login', login);
router.delete('/users/:id', loginCheck, deleteUser);
router.put('/users/:id', loginCheck, updateUser);
router.post('/logout', logout);
router.get('/user/profile', loginCheck, userProfile);

export { router as users };
