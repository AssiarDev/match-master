import type { Request, Response } from 'express';
import { TeamService } from '../service/teamService';

const teamService = new TeamService();

export const getAllTeams = async (req: Request, res: Response) => {
  try {
    const result = await teamService.allTeams() as any;
    if (result.success === false && result.message)
      return res.status(400).json(result);
    return res.json(result);
  } catch (err) {
    console.error('Une erreur est survenue', err);
    return res
      .status(500)
      .json({ success: false, message: 'Erreur serveur' });
  }
};

export const getTeamId = async (req: Request, res: Response) => {
  try {
    const teamId = Number(req.params.id);
    const data = await teamService.teamById(teamId);
    return res.json(data);
  } catch (err) {
    console.error('error backend :', (err as Error).message);
    return res
      .status(500)
      .json({ error: "Impossible de récupérer l'id de l'equipe" });
  }
};

export const getTeamsOfLeague = async (req: Request, res: Response) => {
  try {
    const leagueId = Number(req.params.id);
    const data = await teamService.teamByLeague(leagueId);
    return res.json(data);
  } catch (err) {
    console.error('error backend :', (err as Error).message);
    return res
      .status(500)
      .json({
        error: 'Impossible de récupérer les équipes de la compétition',
      });
  }
};
