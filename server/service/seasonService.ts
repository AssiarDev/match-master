import { ISeasonRepository } from '../repositories/season.repository';
import type { ServiceResult, ApiSeason } from '../types/api';

export interface ISeasonService {
  getSeasonsTeams(
    seasonId: number
  ): Promise<ServiceResult<{ seasonsTeams: ApiSeason }>>;
  getSeasonFixtures(
    seasonId: number
  ): Promise<ServiceResult<{ seasonFixtures: unknown[] }>>;
}

/**
 * External API failures are not caught here: they are thrown to the caller,
 * as for every service.
 */
export class SeasonService implements ISeasonService {
  constructor(private readonly seasonRepo: ISeasonRepository) {}
  /**
   * Retrieves all teams for a given season from the external API.
   * @param seasonId - The ID of the season
   * @returns A ServiceResult containing the season data with its teams
   */
  async getSeasonsTeams(
    seasonId: number
  ): Promise<ServiceResult<{ seasonsTeams: ApiSeason }>> {
    const result = await this.seasonRepo.fetchSeasonsTeams(seasonId);
    return { success: true, seasonsTeams: result.data };
  }

  /**
   * Retrieves all fixtures (matches) for a given season from the external API.
   * @param seasonId - The ID of the season
   * @returns A ServiceResult containing an array of fixtures
   */
  async getSeasonFixtures(
    seasonId: number
  ): Promise<ServiceResult<{ seasonFixtures: unknown[] }>> {
    const result = await this.seasonRepo.fetchSeasonFixtures(seasonId);
    return { success: true, seasonFixtures: result.data ?? [] };
  }
}
