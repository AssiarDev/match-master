import type { Request, Response } from 'express';
import { ScorersService } from '../service/scorersService';

const scorersService = new ScorersService();

export const topScorers = async (req: Request, res: Response) => {
  try {
    const leagueId = Number(req.params.id);
    const data = await scorersService.getTopScorers(leagueId);
    return res.json(data.scorers);
  } catch (err) {
    console.error(
      'Impossible de récupérer la liste des meilleurs buteurs',
      (err as Error).message
    );
    return res
      .status(500)
      .json({
        error: 'Impossible de récupérer la liste des meilleurs buteurs',
      });
  }
};
