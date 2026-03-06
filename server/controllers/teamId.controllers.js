import { getOneTeamById } from "../service/database/teamsServices.js";

export const getTeamId = async (req, res) => {
    try {
        const teamId = Number(req.params.id)

        const data = await getOneTeamById(teamId)
        return res.json(data)
    } catch (err){
        console.error('error backend :', err.message)
        return res.status(500).json({ error: "Impossible de récupérer l'id de l'equipe"})
    }
}