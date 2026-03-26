import { MatchesRepository } from "../repositories/matches.repository";
import { SeasonService } from "./seasonService";
import { LeagueService } from "./leagueService";
import type { ApiMatch, ServiceResult } from "../types/api";

const matchesRepo = new MatchesRepository();
const leagueService = new LeagueService();
const seasonService = new SeasonService();

export class MatchesService {
  async getLeagueMatches(leagueId: number): Promise<ServiceResult<{ matches: unknown[] }>> {
    try {
      const seasonResult =
        await leagueService.getLeagueCurrentSeason(leagueId);
      if (!seasonResult.success) throw new Error(seasonResult.message);
      if (seasonResult.league == null) throw new Error("No current season for this league");
      const seasonId = seasonResult.league;
      const fixtures = await seasonService.getSeasonFixtures(seasonId);
      if (!fixtures.success) throw new Error(fixtures.message);
      return { success: true, matches: fixtures.seasonFixtures };
    } catch (error) {
      return {
        success: false,
        message: `Impossible de récupérer les matchs de la ligues : ${error}`,
      };
    }
  }

  async getMatchesByDate(date: string): Promise<ServiceResult<{ matches: Record<string, { flag: string; matches: ApiMatch[] }> }>> {
    try {
      const result = await matchesRepo.fetchMatchesByDate(date);
      const fixtures = result.data || [];
      const grouped = fixtures.reduce(
        (acc: Record<string, { flag: string; matches: ApiMatch[] }>, match: ApiMatch) => {
          const leagueName = match.league?.name || "unknown league";
          const flag = match.league?.image_path || "";
          if (!acc[leagueName]) {
            acc[leagueName] = { flag, matches: [] };
          }
          acc[leagueName].matches.push(match);
          return acc;
        },
        {}
      );
      return { success: true, matches: grouped };
    } catch (error) {
      return {
        success: false,
        message: `Impossible de récupérer les matchs groupés par date : ${error}`,
      };
    }
  }

  async getMatchesByTeam(teamId: number): Promise<ServiceResult<{ matches: ApiMatch[] }>> {
    try {
      const result = await matchesRepo.fetchMatchesByTeam(teamId);
      return { success: true, matches: result.data || [] };
    } catch (error) {
      return {
        success: false,
        message: `Impossible de récupérer les matchs par équipes : ${error}`,
      };
    }
  }
}
