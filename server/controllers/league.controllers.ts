import type { Request, Response } from 'express';
import { LeagueService } from '../service/leagueService';
import { LeagueApiRepository } from '../repositories/leagueApi.repository';
import { LeagueDBRepository } from '../repositories/leagueDB.repository';

const leagueService = new LeagueService(
  new LeagueApiRepository(),
  new LeagueDBRepository()
);

export const allLeagues = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const result = await leagueService.getAllLeague();
    if (!result.success) {
      res.status(404).json({ message: result.message });
      return;
    }
    res.status(200).json(result.leagues);
  } catch (error) {
    console.error("Erreur lors de l'exécution de la requête", error);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
};
