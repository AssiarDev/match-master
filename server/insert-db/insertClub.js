import pool from "../db/db.js";
import { fetchChampionshipIds, fetchTeams } from "../api/api.js";

export const insertClub = async (teams, competitionId) => {
    try {
        const query = `
            INSERT INTO "Club" (id, name, country, id_competition, emblem, stadium) 
            VALUES ($1, $2, $3, $4, $5, $6)
            ON CONFLICT (id) DO NOTHING;
        `;

        await Promise.all(
            teams.map(team => pool.query(query, [
                team.id,
                team.name,
                team.area?.name || "Inconnu", 
                competitionId,
                team.crest || null,
                team.venue || null
            ]))
        );

        console.log("Clubs insérés avec succès dans la base de données !");
    } catch (e) {
        console.error("Erreur lors de l'insertion des clubs :", e.message);
    }
};

const main = async () => {
    try {
        const championshipIds = await fetchChampionshipIds();
        const clubData = await fetchTeams(championshipIds);

        await Promise.all(
            clubData.map((teamsData, index) => {
                const competitionId = championshipIds[index];
                return insertClub(teamsData.teams, competitionId);
            })
        );

        console.log("Tous les clubs ont été insérés avec succès !");
    } catch (e) {
        console.error("Erreur lors de la récupération des clubs :", e.message);
    }
};

main();