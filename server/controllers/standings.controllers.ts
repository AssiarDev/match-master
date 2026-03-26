import type { Request, Response } from 'express';
import { StandingService } from '../service/standingService';

const standingService = new StandingService();

export const standingsFixtures = async (req: Request, res: Response): Promise<void> => {
  try {
    const leagueId = parseInt(req.params.id, 10);
    if (isNaN(leagueId) || leagueId <= 0) {
      res.status(400).json({ error: 'ID invalide' });
      return;
    }
    const data = await standingService.getStandingFixtures(leagueId);
    if (!data.success) {
      res.status(500).json({ error: data.message });
      return;
    }
    res.json(data.standing);
  } catch (error) {
    console.error(
      "Une erreur est survenue lors de l'execution getStandingsFixtures:",
      (error as Error).message
    );
    res
      .status(500)
      .json({
        error:
          "Une erreur est survenue lors de l'execution getStandingsFixtures",
      });
  }
};
