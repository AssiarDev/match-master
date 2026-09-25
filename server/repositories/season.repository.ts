import { sportmonksGet } from '../lib/sportmonksClient';
import { ApiResponse, ApiSeason } from '../types/api';

export interface ISeasonRepository {
  fetchSeasonsTeams(seasonId: number): Promise<ApiResponse<ApiSeason>>;
  fetchSeasonFixtures(seasonId: number): Promise<ApiResponse<unknown[]>>;
}

export class SeasonRepository implements ISeasonRepository {
  fetchSeasonsTeams(seasonId: number): Promise<ApiResponse<ApiSeason>> {
    return sportmonksGet(`/seasons/${seasonId}?include=teams`);
  }

  fetchSeasonFixtures(seasonId: number): Promise<ApiResponse<unknown[]>> {
    return sportmonksGet(`/schedules/seasons/${seasonId}`);
  }
}
