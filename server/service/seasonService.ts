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
    try {
      const result = await this.seasonRepo.fetchSeasonsTeams(seasonId);
      return { success: true, seasonsTeams: result.data };
    } catch (error) {
      return {
        success: false,
        message: `Impossible de récupérer les saisons de l'équipe : ${error}`,
      };
    }
  }

  /**
   * Retrieves all fixtures (matches) for a given season from the external API.
   * @param seasonId - The ID of the season
   * @returns A ServiceResult containing an array of fixtures
   */
  async getSeasonFixtures(
    seasonId: number
  ): Promise<ServiceResult<{ seasonFixtures: unknown[] }>> {
    try {
      const result = await this.seasonRepo.fetchSeasonFixtures(seasonId);
      return { success: true, seasonFixtures: result.data ?? [] };
    } catch (error) {
      return {
        success: false,
        message: `Impossible de récupérer les fixtures de la saison : ${error}`,
      };
    }
  }
}
