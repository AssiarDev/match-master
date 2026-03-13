import { MatchesService } from "../service/matchesService.js";

const matchesService = new MatchesService()

export const matchByDate = async (req, res) => {
    try {
        const { date } = req.query

        if (!date){
            return res.status(400).json({error: 'La date est obligatoire' })
        }

        const result = await matchesService.getMatchesByDate(date)

        res.json({ data: result.matches })
    } catch (error) {
        console.error("Une error est survenue lors de l\`'execution de matchByDate :", error)
        return res.status(500).json({ error: "Une error est survenue lors de l\`'execution de matchByDate"})
    }
}

export const leaguesMatches = async (req, res) => {
    try {
        const leagueId = req.params.id

        const data = await matchesService.getLeagueMatches(leagueId)
        return res.json(data.matches)
    } catch (error){
        console.error('Une erreur est survenue lors de l`\'execution de leaguesMatches', error)
        return res.status(500).json({ error: "Une erreur est survenue lors de l`\'execution de leaguesMatches"})
    }
}

export const matchesByTeam = async (req, res) => {
    try {
        const { teamId } = req.params

        const result = await matchesService.getMatchesByTeam(teamId)

        return res.json({ data: result.matches })
    } catch (error){
        console.error('Une erreur est survenu lors de l\'éxecution de matchesByTeam')
        return res.status(500).json({ error: 'Une erreur est survenu lors de l\'éxecution de matchesByTeam' })
    }
}