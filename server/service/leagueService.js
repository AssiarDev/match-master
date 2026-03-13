import { LeagueApiRepository } from "../repositories/leagueApi.repository.js";
import { LeagueDBRepository } from "../repositories/leagueDB.repository.js";

const leagueApiRepo = new LeagueApiRepository()
const leagueDBRepo = new LeagueDBRepository

export class LeagueService{
    async getAllLeague(){
        try {
            const result = await leagueDBRepo.findAllLeague()
            return { success: true, leagues: result}
        } catch(error){
            return { success: false, message: `Impossible de récupérer les ligues : ${error}`}
        }
    }

      
    async getLeagueSeasons(leagueId) {
        try {
            const result = await leagueApiRepo.fetchLeagueSeasons(leagueId);
            return { success: true, seasons: result.data?.seasons };
        } catch (error) {
            return { success: false, message: `Impossible de récupérer les saisons : ${error}` };
        }
    }

    async getLeague(leagueId){
        try {
            const result = await leagueDBRepo.findLeague(leagueId)
            return { success: true, league: result }
        } catch(error){
            return { success: false, message: `Erreur lors de la récupération de la ligue : ${error}`}
        }
    }

    async getLeagueCurrentSeason(leagueId){
        try {
            const result = await leagueApiRepo.fetchLeagueCurrentSeason(leagueId)
            return { success: true, league: result.data?.currentseason?.id}
        } catch(error){
            return { success: false, message: `Erreur lors de la récupération de la saison courrante de la ligue : ${error}`}
        }
    }

    async getLeagueWithSeasons(leagueId){
        try {
            const result = await leagueApiRepo.fetchLeagueWithSeasons(leagueId)
            return { success: true, league: result.data }
        } catch(error){
            return { success: false, message: `Erreur lors de la récupération de la ligue avec ses saisons : ${error}`}
        }
    }

}