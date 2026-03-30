import type { Request, Response } from 'express';
import { ScorersService } from '../service/scorersService';
import { ScorersRepository } from '../repositories/scorers.repository';
import { LeagueService } from '../service/leagueService';
import { LeagueApiRepository } from '../repositories/leagueApi.repository';
import { LeagueDBRepository } from '../repositories/leagueDB.repository';
import { PlayersRepository } from '../repositories/players.repository';

const scorersService = new ScorersService(
  new ScorersRepository(),
  new LeagueService(
    new LeagueApiRepository(),
    new LeagueDBRepository()
  ),
  new PlayersRepository()
);

export const topScorers = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const leagueId = Number(req.params.id);
    const data = await scorersService.getTopScorers(leagueId);
    if (!data.success) {
      res.status(500).json({ error: data.message });
      return;
    }
    res.json(data.scorers);
  } catch (err) {
    console.error(
      'Impossible de récupérer la liste des meilleurs buteurs',
      (err as Error).message
    );
    res.status(500).json({
      error: 'Impossible de récupérer la liste des meilleurs buteurs',
    });
  }
};
