import type { Request, Response } from 'express';
import { TeamService } from '../service/teamService';
import { TeamDBRepository } from '../repositories/teamDB.repository';
import { LeagueApiRepository } from '../repositories/leagueApi.repository';
import { SeasonRepository } from '../repositories/season.repository';

const teamService = new TeamService(
  new TeamDBRepository(),
  new LeagueApiRepository(),
  new SeasonRepository()
);

export const getAllTeams = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const result = await teamService.allTeams();
    if ('success' in result && !result.success) {
      res.status(400).json(result);
      return;
    }
    res.json(result);
  } catch (err) {
    console.error('Une erreur est survenue', err);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
};

export const getTeamId = async (req: Request, res: Response): Promise<void> => {
  try {
    const teamId = Number(req.params.id);
    const data = await teamService.teamById(teamId);
    res.json(data);
  } catch (err) {
    console.error('error backend :', (err as Error).message);
    res.status(500).json({ error: "Impossible de récupérer l'id de l'equipe" });
  }
};

export const getTeamsOfLeague = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const leagueId = Number(req.params.id);
    const data = await teamService.teamByLeague(leagueId);

    if (!data.success) {
      res.status(500).json({ error: data.message });
      return;
    }
    res.json(data.teams);
  } catch (err) {
    console.error('error backend :', (err as Error).message);
    res.status(500).json({
      error: 'Impossible de récupérer les équipes de la compétition',
    });
  }
};
