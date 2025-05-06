import { fetchChampionshipIds, fetchPlayersForTeams } from "../api/api.js";
import pool from "../db/db.js";

export const insertTeam = async (players) => {
    try {
        // Vérifier que tous les `id_club` existent avant d'insérer
        for (const player of players) {
            const clubExists = await pool.query('SELECT id FROM "Club" WHERE id = $1', [player.id_club]);

            if (clubExists.rowCount === 0) {
                console.warn(`Club ID ${player.id_club} n'existe pas, joueur ignoré`);
                continue;
            }

            // Requête d'insertion avec gestion des doublons
            await pool.query(`
                INSERT INTO "Player" (id, name, position, date_of_birth, nationality, id_club) 
                VALUES ($1, $2, $3, $4, $5, $6)
                ON CONFLICT (id) DO NOTHING;
            `, [
                player.id,
                player.name,
                player.position,
                player.date_of_birth || "2000-01-01",
                player.nationality,
                player.id_club
            ]);
        }

        console.log("Joueurs insérés avec succès !");
    } catch (e) {
        console.error("Erreur lors de l'insertion des joueurs :", e.message);
    }
};

// Récupération des équipes et insertion
const main = async () => {
    try {
        const competitionIds = await fetchChampionshipIds();

        if (!competitionIds || competitionIds.length === 0) {
            console.error("Aucune compétition trouvée.");
            return;
        }

        const players = await fetchPlayersForTeams(competitionIds);

        if (!players || players.length === 0) {
            console.warn("⚠️ Aucun joueur récupéré.");
            return;
        }

        await insertTeam(players);

        console.log("Tous les joueurs ont été insérés !");
    } catch (e) {
        console.error("Erreur lors de la récupération des équipes :", e.message);
    }
};

main();