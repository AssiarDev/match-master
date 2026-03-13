import { ScorersService } from "../service/scorersService.js";

const scorersService = new ScorersService()

export const topScorers = async (req, res) => {
    try {
        const leagueId = req.params.id

        const data = await scorersService.getTopScorers(leagueId)
        return res.json(data.scorers)
    } catch (err){
        console.error("Impossible de récupérer la liste des meilleurs buteurs", err.message)
        return res.status(500).json({ error: "Impossible de récupérer la liste des meilleurs buteurs"})
    }
}