import { SeasonRepository } from "../repositories/season.repository.js";

const seasonRepo = new SeasonRepository()

export class SeasonService{
    async getSeasonsTeams(seasonId){
        try {
            const result = await seasonRepo.fetchSeasonsTeams(seasonId)
            return { success: true, seasonsTeams: result.data?.season}
        } catch (error){
            return { success: false, message: `Impossible de récupérer les saisons de l\'équipe : ${error}`}
        }
    }

    async getSeasonFixtures(seasonId){
        try{
            const result = await seasonRepo.fetchSeasonFixtures(seasonId)
            return { success: true, seasonFixtures: result.data ?? [] }
        } catch (error){
            return { success: false, message: `Impossible de récupérer les fixtures de la saison : ${error}`}
        }
    }
}