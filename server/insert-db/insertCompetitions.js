import pool from "../db/db.js";
import { fetchAllCompetitions } from "../api/api.js";

console.log('pool :', pool)

export const insertCompetitions = async () => {

    try {
        // Récupérer les données
        const competitionData = await fetchAllCompetitions();
        if (!competitionData || !Array.isArray(competitionData.competitions)) {
            console.error("Aucune compétition trouvée.");
        return;
        }

        // Requête d'insertion
        const query = `
            INSERT INTO "Competition" (id, name, place, emblem, start_date, end_date, type)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            ON CONFLICT (id) DO NOTHING;
        `;

        // Parcourir et insérer chaque compétition
        for (const competition of competitionData.competitions.filter(c => c.type === "LEAGUE")) {
            await pool.query(query, [
                competition.id,
                competition.name,
                competition.area?.name || null,
                competition.emblem || null,
                competition.currentSeason?.startDate || null,
                competition.currentSeason?.endDate || null,
                competition.type
              ]);
        
        }

        console.log('Compétitions insérées avec succès dans la base de données.');
    } catch (e){
        console.error(`Erreur lors de l\'insertion des competitions :`, e.message)
    };
};

insertCompetitions();
