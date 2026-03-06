import { fetchMatchesByDate } from "../service/api/matchesApi.js";

export const getMatchesByDate = async (req, res) => {
    try {
        const { date } = req.query

        if (!date) {
            res.status(400).json({ error: "La date est obligatoire" });
        }

        const groupedMatches = await fetchMatchesByDate(date);

        res.json({ data: groupedMatches });
    } catch (err) {
        console.error("Erreur backend :", err);
        return res.status(500).json({ error: "Erreur serveur" });
    }

}
