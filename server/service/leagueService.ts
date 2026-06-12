import { ILeagueApiRepository } from '../repositories/leagueApi.repository';
import { ILeagueDBRepository } from '../repositories/leagueDB.repository';
import type { ServiceResult, ApiSeason, ApiLeague } from '../types/api';

type LeagueRow = Awaited<
  ReturnType<ILeagueDBRepository['findAllLeague']>
>[number];

export interface ILeagueService {
  getAllLeague(): Promise<ServiceResult<{ leagues: LeagueRow[] }>>;
  getLeagueSeasons(
    leagueId: number
  ): Promise<ServiceResult<{ seasons: ApiSeason[] | undefined }>>;
  getLeague(leagueId: number): Promise<
    ServiceResult<{
      league: Awaited<ReturnType<ILeagueDBRepository['findLeague']>>;
    }>
  >;
  getLeagueCurrentSeason(
    leagueId: number
  ): Promise<ServiceResult<{ league: number | undefined }>>;
  getLeagueWithSeasons(
    leagueId: number
  ): Promise<ServiceResult<{ league: ApiLeague }>>;
}

export class LeagueService implements ILeagueService {
  constructor(
    private readonly leagueApiRepo: ILeagueApiRepository,
    private readonly leagueDBRepo: ILeagueDBRepository
  ) {}

  /**
   * Retrieves all leagues from the database.
   * @returns A ServiceResult containing an array of leagues
   */
  async getAllLeague(): Promise<ServiceResult<{ leagues: LeagueRow[] }>> {
    try {
      const result = await this.leagueDBRepo.findAllLeague();
      return { success: true, leagues: result };
    } catch (error) {
      return {
        success: false,
        message: `Impossible de récupérer les ligues : ${error}`,
      };
    }
  }

  /**
   * Retrieves all seasons for a given league from the external API.
   * @param leagueId - The ID of the league
   * @returns A ServiceResult containing an array of seasons
   */
  async getLeagueSeasons(
    leagueId: number
  ): Promise<ServiceResult<{ seasons: ApiSeason[] | undefined }>> {
    try {
      const result = await this.leagueApiRepo.fetchLeagueSeasons(leagueId);
      return { success: true, seasons: result.data?.seasons };
    } catch (error) {
      return {
        success: false,
        message: `Impossible de récupérer les saisons : ${error}`,
      };
    }
  }

  /**
   * Retrieves a single league by its ID from the database.
   * @param leagueId - The ID of the league
   * @returns A ServiceResult containing the league or null if not found
   */
  async getLeague(leagueId: number): Promise<
    ServiceResult<{
      league: Awaited<ReturnType<ILeagueDBRepository['findLeague']>>;
    }>
  > {
    try {
      const result = await this.leagueDBRepo.findLeague(leagueId);
      return { success: true, league: result };
    } catch (error) {
      return {
        success: false,
        message: `Erreur lors de la récupération de la ligue : ${error}`,
      };
    }
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
    try {
      const result =
        await this.leagueApiRepo.fetchLeagueCurrentSeason(leagueId);
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
    } catch (error) {
      return {
        success: false,
        message: `Erreur lors de la récupération de la saison courrante de la ligue : ${error}`,
      };
    }
  }

  /**
   * Retrieves a league along with all its seasons from the external API.
   * @param leagueId - The ID of the league
   * @returns A ServiceResult containing the league with its seasons
   */
  async getLeagueWithSeasons(
    leagueId: number
  ): Promise<ServiceResult<{ league: ApiLeague }>> {
    try {
      const result = await this.leagueApiRepo.fetchLeagueWithSeasons(leagueId);
      return { success: true, league: result.data };
    } catch (error) {
      return {
        success: false,
        message: `Erreur lors de la récupération de la ligue avec ses saisons : ${error}`,
      };
    }
  }
}
