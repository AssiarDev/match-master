import { IScorersRepository } from '../repositories/scorers.repository';
import { ILeagueService } from './leagueService';
import { IPlayersRepository } from '../repositories/players.repository';
import type { ApiScorer, ServiceResult } from '../types/api';
import { MESSAGES } from '../constants/messages';

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
   * A business failure of a called service is returned as is; API and
   * database failures are thrown to the caller.
   * @param id - The ID of the league
   * @returns A ServiceResult containing an array of enriched scorers, or NOT_FOUND if the league has no current season
   */
  async getTopScorers(
    id: number
  ): Promise<ServiceResult<{ scorers: EnrichedScorer[] }>> {
    const seasonResult = await this.leagueService.getLeagueCurrentSeason(id);
    if (!seasonResult.success) return seasonResult;
    if (seasonResult.league == null)
      return {
        success: false,
        reason: 'NOT_FOUND',
        message: MESSAGES.league.noCurrentSeason,
      };
    const scorersResult = await this.scorersRepo.fetchTopScorers(
      seasonResult.league
    );
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
  }
}
