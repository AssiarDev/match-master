import { IMatchRepository } from '../repositories/matches.repository';
import { ISeasonService } from './seasonService';
import { ILeagueService } from './leagueService';
import type { ApiMatch, ApiLiveMatch, ServiceResult } from '../types/api';

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
  getLiveMatches(): Promise<ServiceResult<{ matches: ApiLiveMatch[] }>>;
}

/**
 * External API failures are not caught here: they are thrown to the caller,
 * as for every service. A business failure of a called service is returned
 * as is.
 */
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
    const seasonResult =
      await this.leagueService.getLeagueCurrentSeason(leagueId);
    if (!seasonResult.success) return seasonResult;
    if (seasonResult.league == null) return { success: true, matches: [] };
    const fixtures = await this.seasonService.getSeasonFixtures(
      seasonResult.league
    );
    if (!fixtures.success) return fixtures;
    return { success: true, matches: fixtures.seasonFixtures };
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
  }

  /**
   * Retrieves all matches (past and upcoming) for a given team.
   * @param teamId - The ID of the team
   * @returns A ServiceResult containing an array of matches
   */
  async getMatchesByTeam(
    teamId: number
  ): Promise<ServiceResult<{ matches: ApiMatch[] }>> {
    const result = await this.matchesRepo.fetchMatchesByTeam(teamId);
    return { success: true, matches: result.data || [] };
  }

  /**
   * Retrieves all currently live matches.
   * @returns A ServiceResult containing an array of live matches
   */
  async getLiveMatches(): Promise<ServiceResult<{ matches: ApiLiveMatch[] }>> {
    const result = await this.matchesRepo.fetchLiveMatches();
    return { success: true, matches: result.data || [] };
  }
}
