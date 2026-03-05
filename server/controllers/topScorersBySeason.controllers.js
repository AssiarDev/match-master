import { getTopScorersFixtures } from "../service/api/topScorers.js"

export const getTopScorers = async (req, res) => {
    try {
        const leagueId = req.params.id

        const data = await getTopScorersFixtures(leagueId)
        return res.json(data)
    } catch (err){
        console.error('error backend :', err.message)
        return res.status(500).json({ error: "Impossible de récupérer la liste des meilleurs buteurs"})
    }
}