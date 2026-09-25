import { ILeagueApiRepository } from '../repositories/leagueApi.repository';
import { ILeagueDBRepository } from '../repositories/leagueDB.repository';
import type { ServiceResult, ApiSeason, ApiLeague, League } from '../types/api';
import { MESSAGES } from '../constants/messages';

export interface ILeagueService {
  getAllLeague(): Promise<ServiceResult<{ leagues: League[] }>>;
  getLeagueSeasons(
    leagueId: number
  ): Promise<ServiceResult<{ seasons: ApiSeason[] | undefined }>>;
  getLeague(leagueId: number): Promise<ServiceResult<{ league: League }>>;
  getLeagueCurrentSeason(
    leagueId: number
  ): Promise<ServiceResult<{ league: number | undefined }>>;
  getLeagueWithSeasons(
    leagueId: number
  ): Promise<ServiceResult<{ league: ApiLeague }>>;
}

/**
 * Database and external API failures are not caught here: they are thrown
 * to the caller, as for every service.
 */
export class LeagueService implements ILeagueService {
  constructor(
    private readonly leagueApiRepo: ILeagueApiRepository,
    private readonly leagueDBRepo: ILeagueDBRepository
  ) {}

  /**
   * Retrieves all leagues from the database.
   * @returns A ServiceResult containing an array of leagues
   */
  async getAllLeague(): Promise<ServiceResult<{ leagues: League[] }>> {
    const leagues = await this.leagueDBRepo.findAllLeague();
    return { success: true, leagues };
  }

  /**
   * Retrieves all seasons for a given league from the external API.
   * @param leagueId - The ID of the league
   * @returns A ServiceResult containing an array of seasons
   */
  async getLeagueSeasons(
    leagueId: number
  ): Promise<ServiceResult<{ seasons: ApiSeason[] | undefined }>> {
    const result = await this.leagueApiRepo.fetchLeagueSeasons(leagueId);
    return { success: true, seasons: result.data?.seasons };
  }

  /**
   * Retrieves a single league by its ID from the database.
   * @param leagueId - The ID of the league
   * @returns A ServiceResult containing the league, or NOT_FOUND
   */
  async getLeague(
    leagueId: number
  ): Promise<ServiceResult<{ league: League }>> {
    const league = await this.leagueDBRepo.findLeague(leagueId);
    if (!league)
      return {
        success: false,
        reason: 'NOT_FOUND',
        message: MESSAGES.league.notFound,
      };
    return { success: true, league };
  }

  /**
   * Retrieves the active season ID for a given league.
   * If the current season has not started yet, falls back to the most recently completed season.
   * @param leagueId - The ID of the league
   * @returns A ServiceResult containing the season ID, or undefined if none is found
   */
  async getLeagueCurrentSeason(
    leagueId: number
  ): Promise<ServiceResult<{ league: number | undefined }>> {
    const result = await this.leagueApiRepo.fetchLeagueCurrentSeason(leagueId);
    const currentSeason = result.data?.currentseason;

    if (
      currentSeason?.starting_at &&
      new Date(currentSeason.starting_at) > new Date()
    ) {
      const seasonsResult =
        await this.leagueApiRepo.fetchLeagueSeasons(leagueId);
      const pastSeasons = (seasonsResult.data?.seasons ?? []).filter(
        (s) => s.ending_at !== null && new Date(s.ending_at!) < new Date()
      );
      pastSeasons.sort(
        (a, b) =>
          new Date(b.ending_at!).getTime() - new Date(a.ending_at!).getTime()
      );
      return { success: true, league: pastSeasons[0]?.id };
    }

    return { success: true, league: currentSeason?.id };
  }

  /**
   * Retrieves a league along with all its seasons from the external API.
   * @param leagueId - The ID of the league
   * @returns A ServiceResult containing the league with its seasons
   */
  async getLeagueWithSeasons(
    leagueId: number
  ): Promise<ServiceResult<{ league: ApiLeague }>> {
    const result = await this.leagueApiRepo.fetchLeagueWithSeasons(leagueId);
    return { success: true, league: result.data };
  }
}
