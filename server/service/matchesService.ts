import { IMatchRepository } from '../repositories/matches.repository';
import { ISeasonService } from './seasonService';
import { ILeagueService } from './leagueService';
import type { ApiMatch, ServiceResult } from '../types/api';

export interface IMatchesService {
  getLeagueMatches(
    leagueId: number
  ): Promise<ServiceResult<{ matches: unknown[] }>>;
  getMatchesByDate(date: string): Promise<
    ServiceResult<{
      matches: Record<string, { flag: string; matches: ApiMatch[] }>;
    }>
  >;
  getMatchesByTeam(
    teamId: number
  ): Promise<ServiceResult<{ matches: ApiMatch[] }>>;
}

export class MatchesService implements IMatchesService {
  constructor(
    private readonly matchesRepo: IMatchRepository,
    private readonly leagueService: ILeagueService,
    private readonly seasonService: ISeasonService
  ) {}

  /**
   * Retrieves all matches for the current season of a given league.
   * @param leagueId - The ID of the league
   * @returns A ServiceResult containing an array of matches
   */
  async getLeagueMatches(
    leagueId: number
  ): Promise<ServiceResult<{ matches: unknown[] }>> {
    try {
      const seasonResult =
        await this.leagueService.getLeagueCurrentSeason(leagueId);
      if (!seasonResult.success) throw new Error(seasonResult.message);
      if (seasonResult.league == null)
        throw new Error('No current season for this league');
      const seasonId = seasonResult.league;
      const fixtures = await this.seasonService.getSeasonFixtures(seasonId);
      if (!fixtures.success) throw new Error(fixtures.message);
      return { success: true, matches: fixtures.seasonFixtures };
    } catch (error) {
      return {
        success: false,
        message: `Impossible de récupérer les matchs de la ligues : ${error}`,
      };
    }
  }

  /**
   * Retrieves all matches for a given date, grouped by league.
   * @param date - The date in YYYY-MM-DD format
   * @returns A ServiceResult containing matches grouped by league name
   */
  async getMatchesByDate(date: string): Promise<
    ServiceResult<{
      matches: Record<string, { flag: string; matches: ApiMatch[] }>;
    }>
  > {
    try {
      const result = await this.matchesRepo.fetchMatchesByDate(date);
      const fixtures = result.data || [];
      const grouped = fixtures.reduce(
        (
          acc: Record<string, { flag: string; matches: ApiMatch[] }>,
          match: ApiMatch
        ) => {
          const leagueName = match.league?.name || 'unknown league';
          const flag = match.league?.image_path || '';
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

  /**
   * Retrieves all matches (past and upcoming) for a given team.
   * @param teamId - The ID of the team
   * @returns A ServiceResult containing an array of matches
   */
  async getMatchesByTeam(
    teamId: number
  ): Promise<ServiceResult<{ matches: ApiMatch[] }>> {
    try {
      const result = await this.matchesRepo.fetchMatchesByTeam(teamId);
      return { success: true, matches: result.data || [] };
    } catch (error) {
      return {
        success: false,
        message: `Impossible de récupérer les matchs par équipes : ${error}`,
      };
    }
  }
}
