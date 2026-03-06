import { fetchMatchesByTeam } from "../service/api/matchesApi.js";

export const getMatchesByTeam = async (req, res) => {
  try {
    const { teamId } = req.params;

    const matches = await fetchMatchesByTeam(teamId);

    res.json({ data: matches });
  } catch (err) {
    console.error('erreur backend', err);
    return res.status(500).json({ error: "Erreur serveur" });
  }
};