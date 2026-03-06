import { TeamRepository } from "../repositories/team.repository.js";

const teamRepo = new TeamRepository()

export class TeamService {
    async allTeams(){
        const teams = await teamRepo.findAllTeams()
        if (!teams) return { success: false, message: 'Impossible de récupérer toutes les équipes.'}

        return teams
    }

    async teamById(teamId){
        const team = await teamRepo.findById(teamId)
        if(!team) return { success: false, message: "Equipe introuvable via l'id." }

        return team
    }

    async teamByLeague(leagueId){
        const team = await teamRepo.findByLeague(leagueId)
        if(!team) return { success: false, message: 'Equipe introuvable via la ligue.'}

        return team
    }
}