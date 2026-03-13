import { StandingService } from "../service/standingService.js";

const standingService = new StandingService()

export const standingsFixtures = async (req, res) => {
    try {
        const leagueId = req.params.id

        if(!leagueId){
            return res.status(400).json({ error: 'ID obligatoire'})
        }

        const data = await standingService.getStandingFixtures(leagueId)
        return res.json(data.standing)
    } catch (error){
        console.error('Une erreur est survenue lors de l\'execution getStandingsFixtures:', err.message)
        return res.status(500).json({ error: "Une erreur est survenue lors de l\'execution getStandingsFixtures"})
    }
}