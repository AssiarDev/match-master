import { sportmonksGet } from '../lib/sportmonksClient';
import type { ApiResponse, ApiLeague } from '../types/api';

export interface ILeagueApiRepository {
  fetchAllLeague(): Promise<ApiResponse<ApiLeague[]>>;
  fetchLeague(leagueId: number): Promise<ApiResponse<ApiLeague>>;
  fetchLeagueSeasons(leagueId: number): Promise<ApiResponse<ApiLeague>>;
  fetchLeagueCurrentSeason(leagueId: number): Promise<ApiResponse<ApiLeague>>;
  fetchLeagueWithSeasons(leagueId: number): Promise<ApiResponse<ApiLeague>>;
}

export class LeagueApiRepository implements ILeagueApiRepository {
  fetchAllLeague(): Promise<ApiResponse<ApiLeague[]>> {
    return sportmonksGet('/leagues');
  }

  fetchLeague(leagueId: number): Promise<ApiResponse<ApiLeague>> {
    return sportmonksGet(`/leagues/${leagueId}`);
  }

  fetchLeagueSeasons(leagueId: number): Promise<ApiResponse<ApiLeague>> {
    return sportmonksGet(`/leagues/${leagueId}?include=seasons`);
  }

  fetchLeagueCurrentSeason(leagueId: number): Promise<ApiResponse<ApiLeague>> {
    return sportmonksGet(`/leagues/${leagueId}?include=currentSeason.stages`);
  }

  /**
   * Alias of fetchLeagueSeasons: both need the league with all its seasons,
   * so they share a single request. Kept so that its callers (getLeagueWithSeasons
   * and the import scripts) do not change.
   * @param leagueId - The ID of the league
   * @returns The league with its seasons
   */
  fetchLeagueWithSeasons(leagueId: number): Promise<ApiResponse<ApiLeague>> {
    return this.fetchLeagueSeasons(leagueId);
  }
}
