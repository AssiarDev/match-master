import type { Request, Response } from 'express';
import { StandingService } from '../service/standingService';
import { StandingRepository } from '../repositories/standings.repository';
import { TeamService } from '../service/teamService';
import { TeamDBRepository } from '../repositories/teamDB.repository';
import { LeagueApiRepository } from '../repositories/leagueApi.repository';
import { SeasonRepository } from '../repositories/season.repository';
import { LeagueService } from '../service/leagueService';
import { LeagueDBRepository } from '../repositories/leagueDB.repository';

const standingService = new StandingService(
  new StandingRepository(),
  new TeamService(
    new TeamDBRepository(),
    new LeagueApiRepository(),
    new SeasonRepository()
  ),
  new LeagueService(
    new LeagueApiRepository(),
    new LeagueDBRepository()
  )
);

export const standingsFixtures = async (
  req: Request,
  res: Response
): Promise<void> => {
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
    res.status(500).json({
      error: "Une erreur est survenue lors de l'execution getStandingsFixtures",
    });
  }
};
