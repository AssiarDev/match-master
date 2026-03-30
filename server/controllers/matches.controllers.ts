import type { Request, Response } from 'express';
import { MatchesService } from '../service/matchesService';

const matchesService = new MatchesService();

export const matchByDate = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const date = req.query.date as string | undefined;
    if (!date) {
      res.status(400).json({ error: 'La date est obligatoire' });
      return;
    }
    const result = await matchesService.getMatchesByDate(date);
    if (!result.success) {
      res.status(500).json({ error: result.message });
      return;
    }
    res.json({ data: result.matches });
  } catch (error) {
    console.error(
      "Une error est survenue lors de l'execution de matchByDate :",
      error
    );
    res.status(500).json({
      error: "Une error est survenue lors de l'execution de matchByDate",
    });
  }
};

export const leaguesMatches = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const leagueId = parseInt(req.params.id, 10);
    if (isNaN(leagueId) || leagueId <= 0) {
      res.status(400).json({ error: 'ID invalide' });
      return;
    }
    const data = await matchesService.getLeagueMatches(leagueId);
    if (!data.success) {
      res.status(500).json({ error: data.message });
      return;
    }
    res.json(data.matches);
  } catch (error) {
    console.error(
      "Une erreur est survenue lors de l'execution de leaguesMatches",
      error
    );
    res.status(500).json({
      error: "Une erreur est survenue lors de l'execution de leaguesMatches",
    });
  }
};

export const matchesByTeam = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const teamId = parseInt(req.params.teamId, 10);
    if (isNaN(teamId) || teamId <= 0) {
      res.status(400).json({ error: 'ID invalide' });
      return;
    }
    const result = await matchesService.getMatchesByTeam(teamId);
    if (!result.success) {
      res.status(500).json({ error: result.message });
      return;
    }
    res.json({ data: result.matches });
  } catch (error) {
    console.error(
      "Une erreur est survenu lors de l'éxecution de matchesByTeam"
    );
    res.status(500).json({
      error: "Une erreur est survenu lors de l'éxecution de matchesByTeam",
    });
  }
};
