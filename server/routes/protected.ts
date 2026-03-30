import express from 'express';
import type { Request, Response } from 'express';
import { loginCheck } from '../middleware/loginMiddleware';

const router = express.Router();

router.get(
  '/protected-route',
  loginCheck,
  async (req: Request, res: Response) => {
    try {
      const userId = req.user!.id;
      res.status(200).json({ message: 'Accès autorisé', userId });
    } catch (error) {
      res.status(500).json({ error: 'Erreur serveur.' });
    }
  }
);

export { router as protectedRoutes };
