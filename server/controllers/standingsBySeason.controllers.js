import { getStandingsFixtures } from "../service/api/standingsApi.js"

export const getStandings = async (req, res) => {
    try {
        const leagueId = req.params.id

        const data = await getStandingsFixtures(leagueId)
        return res.json(data)
    } catch (err){
        console.error('error backend :', err.message)
        return res.status(500).json({ error: "Impossible de récupérer le classement de la saison"})
    }
}