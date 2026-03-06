import express from 'express';
import { loginCheck } from '../middleware/loginMiddleware.js';

const router = express.Router();

router.get('/protected-route', loginCheck, async (req, res) => {
  try {
    // 🔥 Vérifie que l'utilisateur est bien connecté grâce à `loginCheck`
    const userId = req.user.id;

    res.status(200).json({ message: 'Accès autorisé', userId });
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur.' });
  }
});

export { router as protectedRoutes };
