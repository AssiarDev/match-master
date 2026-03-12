import { getTeamsById } from "../database/teamsServices.js"
import { token, urlAPI } from "../../config.js"
import { getLeagueCurrentSeason } from "./leagues.js"
import { mapDetails } from "../../utils/mapDetails.js"

export const standingsBySeason = async (id) => {
    try {
        const url = `${urlAPI}/standings/seasons/${id}?api_token=${token}&include=form;details.type&filters=standingdetailTypes:128,129,130,131,132,133,134,135,136,137,138`
        const response = await fetch(url)

        if (!response.ok){
            console.error('API standings error :', response.status)
            return []
        }

        const result = await response.json()
        const standings = result?.data || []

        return standings
    } catch (err){
        console.error('Erreur impossible de récupérer les données :', err.message)
        return []
    }
}

export const getStandingsFixtures = async (leagueId) => {
    const seasonId = await getLeagueCurrentSeason(leagueId)
    const seasonStandings = await standingsBySeason(seasonId)

    const teamIds = seasonStandings.map(s => s.participant_id)
    const teams = await getTeamsById(teamIds)

    const teamsById = Object.fromEntries(
        teams.map(s => [s.id, s])
    )

    const enriched = seasonStandings.map(s => {
        const standings = teamsById[s.participant_id]
        const stats = mapDetails(s.details || []);


        return {
            ...s,
            team_name: standings?.name || `Equipe #${s.team_id}`,
            team_image: standings?.image_path || null,
            team_id: s.team_id,
            ...stats
        }
    })

    return enriched
}