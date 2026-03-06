import { teamsByLeague } from "../service/database/teamsServices.js";

export const getTeamsOfLeague = async (req, res) => {
    try {
        const leagueId = Number(req.params.id)
        const data = await teamsByLeague(leagueId)
        return res.json(data)
    } catch(err){
        console.error('error backend :', err.message)
        return res.status(500).json({ error: "Impossible de récupérer les équipes de la compétition"})
    }
}