import type { Request, Response } from 'express';
import { LeagueService } from '../service/leagueService';

const leagueService = new LeagueService();

export const allLeagues = async (req: Request, res: Response) => {
  try {
    const result = await leagueService.getAllLeague();
    if (!result.success)
      return res.status(404).json({ message: result.message });
    res.status(200).json(result.leagues);
  } catch (error) {
    console.error("Erreur lors de l'exécution de la requête", error);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
};
