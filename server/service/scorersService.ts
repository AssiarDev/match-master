import { ScorersRepository } from "../repositories/scorers.repository";
import { LeagueService } from "./leagueService";
import { PlayersRepository } from "../repositories/players.repository";
import type { ApiScorer, ServiceResult } from "../types/api";

interface EnrichedScorer extends ApiScorer {
  player_name: string;
  player_image: string | null;
  team_id: number;
}

const leagueService = new LeagueService();
const scorersRepo = new ScorersRepository();
const playersRepo = new PlayersRepository();

export class ScorersService {
  async getTopScorers(id: number): Promise<ServiceResult<{ scorers: EnrichedScorer[] }>> {
    try {
      const seasonResult = await leagueService.getLeagueCurrentSeason(id);
      if (!seasonResult.success) throw new Error(seasonResult.message);
      const seasonId = seasonResult.league!;
      const scorersResult = await scorersRepo.fetchTopScorers(seasonId);
      const scorers = scorersResult?.data || [];
      const playerIds = scorers.map((s: ApiScorer) => s.player_id);
      const players = await playersRepo.findPlayersByIds(playerIds);
      const playersMap = Object.fromEntries(
        players.map((p) => [p.id, p])
      );
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
