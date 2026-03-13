import { StandingRepository } from "../repositories/standings.repository.js";
import { TeamService } from "./teamService.js";
import { LeagueService } from "./leagueService.js";
import { mapDetails } from "../utils/mapDetails.js";

const standingRepo = new StandingRepository()
const teamService = new TeamService()
const leagueService = new LeagueService()

export class StandingService{

    async getStandingFixtures(leagueId){
        try {
            const seasonResult = await leagueService.getLeagueCurrentSeason(leagueId)
            const seasonId = seasonResult.league
            const seasonStandingResult = await standingRepo.fetchStandingBySeason(seasonId)
            const seasonStanding = seasonStandingResult.data || []
        
            const teamIds = seasonStanding.map(s => s.participant_id)
            const teams = await teamService.teamsByIds(teamIds)

            const teamsById = Object.fromEntries(
                teams.map(s => [s.id, s])
            )

            const enriched = seasonStanding.map(s => {
                const standings = teamsById[s.participant_id]
                const stats = mapDetails(s.details || [])

                return {
                    ...s,
                    team_name: standings?.name || `Equipe #${s.team_id}`,
                    team_image: standings?.image_path || null,
                    team_id: s.team_id,
                    ...stats
                }
            })

            return { success: true, standing: enriched}
        } catch (error){
            return { success: false, message: `Impossible de récupérer le classement ${error}`}
        }
    }
}