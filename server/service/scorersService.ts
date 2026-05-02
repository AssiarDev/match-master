import { IScorersRepository } from '../repositories/scorers.repository';
import { ILeagueService } from './leagueService';
import { IPlayersRepository } from '../repositories/players.repository';
import type { ApiScorer, ServiceResult } from '../types/api';

interface EnrichedScorer extends ApiScorer {
  player_name: string;
  player_image: string | null;
  team_id: number;
}

export class ScorersService {
  constructor(
    private readonly scorersRepo: IScorersRepository,
    private readonly leagueService: ILeagueService,
    private readonly playersRepo: IPlayersRepository
  ) {}

  /**
   * Retrieves the top scorers for the current season of a given league,
   * enriched with player name and image from the database.
   * @param id - The ID of the league
   * @returns A ServiceResult containing an array of enriched scorers
   */
  async getTopScorers(
    id: number
  ): Promise<ServiceResult<{ scorers: EnrichedScorer[] }>> {
    try {
      const seasonResult = await this.leagueService.getLeagueCurrentSeason(id);
      if (!seasonResult.success) throw new Error(seasonResult.message);
      if (seasonResult.league == null)
        throw new Error('No current season for this league');
      const seasonId = seasonResult.league;
      const scorersResult = await this.scorersRepo.fetchTopScorers(seasonId);
      const scorers = scorersResult?.data || [];
      const playerIds = scorers.map((s: ApiScorer) => s.player_id);
      const players = await this.playersRepo.findPlayersByIds(playerIds);
      const playersMap = Object.fromEntries(players.map((p) => [p.id, p]));
      const enriched = scorers.map((s: ApiScorer) => {
        const player = playersMap[s.player_id];
        return {
          ...s,
          player_name: player?.display_name || `Joueur #${s.player_id}`,
          player_image: player?.image_path || null,
          team_id: s.participant_id,
        };
      });
      return { success: true, scorers: enriched };
    } catch (error) {
      return {
        success: false,
        message: `Impossible de récupérer le classement des meilleurs buteurs ${(error as Error).message}`,
      };
    }
  }
}
