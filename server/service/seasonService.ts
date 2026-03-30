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
