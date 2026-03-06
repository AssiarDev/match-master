import { getLeagueMatches } from "../service/api/leagues.js";


export const getCompetitionMatches = async (req, res) => {
  try {
    const leagueId = req.params.id;

    const data = await getLeagueMatches(leagueId)
    return res.json(data)

  } catch (error) {
    console.error("Erreur backend :", error);
    return res.status(500).json({ error: "Impossible de récupérer les matchs de la compétition" });
  }
};
