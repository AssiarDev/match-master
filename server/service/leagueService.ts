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

  async getLeagueCurrentSeason(
    leagueId: number
  ): Promise<ServiceResult<{ league: number | undefined }>> {
    try {
      const result =
        await this.leagueApiRepo.fetchLeagueCurrentSeason(leagueId);
      return { success: true, league: result.data?.currentseason?.id };
    } catch (error) {
      return {
        success: false,
        message: `Erreur lors de la récupération de la saison courrante de la ligue : ${error}`,
      };
    }
  }

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
