import { MatchesRepository } from "../repositories/matches.repository.js";
import { SeasonService } from "./seasonService.js";
import { LeagueService } from "./leagueService.js";

const matchesRepo = new MatchesRepository()
const leagueService = new LeagueService()
const seasonService = new SeasonService()

export class MatchesService {
    async getLeagueMatches(leagueId){
        try {
            const seasonResult = await leagueService.getLeagueCurrentSeason(leagueId)
            const seasonId = seasonResult.league

            const fixtures = await seasonService.getSeasonFixtures(seasonId)
            return { success: true, matches: fixtures.seasonFixtures }

        } catch(error){
            return { success: false, message: `Impossible de récupérer les matchs de la ligues : ${error}`}
        }
    }

    async getMatchesByDate(date){
        try {
            const result = await matchesRepo.fetchMatchesByDate(date)
            const fixtures = result.data || []

            const grouped = fixtures.reduce((acc, match) => {
                const leagueName = match.league?.name || "unknown league"
                const flag = match.league?.image_path || ""

                if(!acc[leagueName]){
                    acc[leagueName] = { flag, matches: [] }
                }

                acc[leagueName].matches.push(match)
                return acc
            }, {})

            return { success: true, matches: grouped }
        } catch (error){
            return { success: false, message: `Impossible de récupérer les matchs groupés par date : ${error}`}
        }
    }

    async getMatchesByTeam(teamId){
        try {
            const result = await matchesRepo.fetchMatchesByTeam(teamId)
            return { success: true, matches: result.data || [] }
        } catch (error){
            return { success: false, message: `Impossible de récupérer les matchs par équipes : ${error}`}
        }
    }
}