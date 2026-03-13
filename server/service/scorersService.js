import { ScorersRepository } from "../repositories/scorers.repository.js";
import { LeagueService } from "./leagueService.js";
import { PlayersRepository } from "../repositories/players.repository.js";

const leagueService = new LeagueService()
const scorersRepo = new ScorersRepository()
const playersRepo = new PlayersRepository()

export class ScorersService{

    async getTopScorers(id){
        try {
            const seasonResult = await leagueService.getLeagueCurrentSeason(id)
            const seasonId = seasonResult.league

            const scorersResult = await scorersRepo.fetchTopScorers(seasonId)
            const scorers = scorersResult?.data || []

            const playerIds = scorers.map(s => s.player_id)
            const players = await playersRepo.findPlayersByIds(playerIds)

            const playersMap = Object.fromEntries(
                players.map(p => [p.id, p])
            )

            const enriched = scorers.map(s => {
                const player = playersMap[s.player_id]

                return {
                    ...s,
                    player_name: player?.display_name || `Joueur #${s.player_id}`,
                    player_image: player?.image_path || null,
                    team_id: s.participant_id
                }
            })

            return { success: true, scorers: enriched}

        } catch (error){
            return { success: false, message: `Impossible de récupérer le classement des meilleurs buteurs ${error.message}`}
        }
    }
}