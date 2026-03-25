import type { Request, Response } from 'express';
import { StandingService } from '../service/standingService';

const standingService = new StandingService();

export const standingsFixtures = async (req: Request, res: Response) => {
  try {
    const leagueId = Number(req.params.id);
    if (!leagueId)
      return res.status(400).json({ error: 'ID obligatoire' });
    const data = await standingService.getStandingFixtures(leagueId);
    return res.json(data.standing);
  } catch (error) {
    console.error(
      "Une erreur est survenue lors de l'execution getStandingsFixtures:",
      (error as Error).message
    );
    return res
      .status(500)
      .json({
        error:
          "Une erreur est survenue lors de l'execution getStandingsFixtures",
      });
  }
};
