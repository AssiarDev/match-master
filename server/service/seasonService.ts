import { SeasonRepository } from "../repositories/season.repository";

const seasonRepo = new SeasonRepository();

export class SeasonService {
  async getSeasonsTeams(seasonId: number) {
    try {
      const result = await seasonRepo.fetchSeasonsTeams(seasonId);
      return { success: true, seasonsTeams: result.data?.season };
    } catch (error) {
      return {
        success: false,
        message: `Impossible de récupérer les saisons de l'équipe : ${error}`,
      };
    }
  }

  async getSeasonFixtures(seasonId: number) {
    try {
      const result = await seasonRepo.fetchSeasonFixtures(seasonId);
      return { success: true, seasonFixtures: result.data ?? [] };
    } catch (error) {
      return {
        success: false,
        message: `Impossible de récupérer les fixtures de la saison : ${error}`,
      };
    }
  }
}
