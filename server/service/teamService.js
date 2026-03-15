import { LeagueApiRepository } from "../repositories/leagueApi.repository.js";
import { SeasonRepository } from "../repositories/season.repository.js";
import { TeamDBRepository } from "../repositories/teamDB.repository.js";

const teamDBRepo = new TeamDBRepository()
const leagueApiRepo = new LeagueApiRepository()
const seasonRepo = new SeasonRepository()

export class TeamService {
    async allTeams(){
        const teams = await teamDBRepo.findAllTeams()
        if (!teams) return { success: false, message: 'Impossible de récupérer toutes les équipes.'}

        return teams
    }

    async teamById(teamId){
        const team = await teamDBRepo.findById(teamId)
        if(!team) return { success: false, message: "Equipe introuvable via l'id." }

        return team
    }

    async teamsByIds(teamIds){
        const team = await teamDBRepo.findByIds(teamIds)
        if(!team) return { success: false, message: "Equipes introuvable via l'id." }

        return team
    }

    async teamByLeague(leagueId){
        const result = await teamDBRepo.findByLeague(leagueId)
        if(!result) return { success: false, message: 'Equipe introuvable via la ligue.'}

        return result.teams
    }

    async teamsForLeague(leagueId){
        try {
            const seasonData = await leagueApiRepo.fetchLeagueSeasons(leagueId)
            const seasons = seasonData.data?.seasons ?? []

            const activeSeason = seasons.find((s) => s.is_current === true)
            if (!activeSeason) return []

            const teamsData = await seasonRepo.fetchSeasonsTeams(activeSeason.id)
            const result = { season: activeSeason, teams: teamsData.data?.teams ?? {} }

            return { success: true, result}
        } catch (error){
            return { success: false, message: `Impossible de récupérer les équipes pour la ligue : ${error}`}
        }
    }
}