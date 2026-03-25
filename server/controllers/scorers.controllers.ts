import type { Request, Response } from 'express';
import { ScorersService } from '../service/scorersService';

const scorersService = new ScorersService();

export const topScorers = async (req: Request, res: Response): Promise<void> => {
  try {
    const leagueId = Number(req.params.id);
    const data = await scorersService.getTopScorers(leagueId);
    if (!data.success) {
      res.status(500).json({ error: data.message });
      return;
    }
    res.json(data.scorers);
  } catch (err) {
    console.error(
      'Impossible de récupérer la liste des meilleurs buteurs',
      (err as Error).message
    );
    res
      .status(500)
      .json({
        error: 'Impossible de récupérer la liste des meilleurs buteurs',
      });
  }
};
