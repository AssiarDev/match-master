import type { Request, Response } from 'express';
import { MatchesService } from '../service/matchesService';

const matchesService = new MatchesService();

export const matchByDate = async (req: Request, res: Response) => {
  try {
    const date = req.query.date as string | undefined;
    if (!date)
      return res.status(400).json({ error: 'La date est obligatoire' });
    const result = await matchesService.getMatchesByDate(date);
    res.json({ data: result.matches });
  } catch (error) {
    console.error(
      "Une error est survenue lors de l'execution de matchByDate :",
      error
    );
    return res
      .status(500)
      .json({
        error: "Une error est survenue lors de l'execution de matchByDate",
      });
  }
};

export const leaguesMatches = async (req: Request, res: Response) => {
  try {
    const leagueId = Number(req.params.id);
    const data = await matchesService.getLeagueMatches(leagueId);
    return res.json(data.matches);
  } catch (error) {
    console.error(
      "Une erreur est survenue lors de l'execution de leaguesMatches",
      error
    );
    return res
      .status(500)
      .json({
        error: "Une erreur est survenue lors de l'execution de leaguesMatches",
      });
  }
};

export const matchesByTeam = async (req: Request, res: Response) => {
  try {
    const teamId = Number(req.params.teamId);
    const result = await matchesService.getMatchesByTeam(teamId);
    return res.json({ data: result.matches });
  } catch (error) {
    console.error(
      "Une erreur est survenu lors de l'éxecution de matchesByTeam"
    );
    return res
      .status(500)
      .json({
        error: "Une erreur est survenu lors de l'éxecution de matchesByTeam",
      });
  }
};
