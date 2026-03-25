import { LeagueApiRepository } from "../repositories/leagueApi.repository";
import { LeagueDBRepository } from "../repositories/leagueDB.repository";
import type { ServiceResult, ApiSeason, ApiLeague } from "../types/api";

const leagueApiRepo = new LeagueApiRepository();
const leagueDBRepo = new LeagueDBRepository();

type LeagueRow = Awaited<ReturnType<LeagueDBRepository["findAllLeague"]>>[number];

export class LeagueService {
  async getAllLeague(): Promise<ServiceResult<{ leagues: LeagueRow[] }>> {
    try {
      const result = await leagueDBRepo.findAllLeague();
      return { success: true, leagues: result };
    } catch (error) {
      return {
        success: false,
        message: `Impossible de récupérer les ligues : ${error}`,
      };
    }
  }

  async getLeagueSeasons(leagueId: number): Promise<ServiceResult<{ seasons: ApiSeason[] | undefined }>> {
    try {
      const result = await leagueApiRepo.fetchLeagueSeasons(leagueId);
      return { success: true, seasons: result.data?.seasons };
    } catch (error) {
      return {
        success: false,
        message: `Impossible de récupérer les saisons : ${error}`,
      };
    }
  }

  async getLeague(leagueId: number): Promise<ServiceResult<{ league: Awaited<ReturnType<LeagueDBRepository["findLeague"]>> }>> {
    try {
      const result = await leagueDBRepo.findLeague(leagueId);
      return { success: true, league: result };
    } catch (error) {
      return {
        success: false,
        message: `Erreur lors de la récupération de la ligue : ${error}`,
      };
    }
  }

  async getLeagueCurrentSeason(leagueId: number): Promise<ServiceResult<{ league: number | undefined }>> {
    try {
      const result =
        await leagueApiRepo.fetchLeagueCurrentSeason(leagueId);
      return { success: true, league: result.data?.currentseason?.id };
    } catch (error) {
      return {
        success: false,
        message: `Erreur lors de la récupération de la saison courrante de la ligue : ${error}`,
      };
    }
  }

  async getLeagueWithSeasons(leagueId: number): Promise<ServiceResult<{ league: ApiLeague }>> {
    try {
      const result = await leagueApiRepo.fetchLeagueWithSeasons(leagueId);
      return { success: true, league: result.data };
    } catch (error) {
      return {
        success: false,
        message: `Erreur lors de la récupération de la ligue avec ses saisons : ${error}`,
      };
    }
  }
}
