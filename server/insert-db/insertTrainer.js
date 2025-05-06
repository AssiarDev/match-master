import pool from "../db/db.js";
import { fetchChampionshipIds, fetchTrainersForTeams } from "../api/api.js";

export const insertTrainer = async (trainers) => {
    try {
        if (!trainers || trainers.length === 0) {
            console.warn("Aucun entraîneur à insérer.");
            return;
        }

        const fixDateFormat = (date) => {
            if (!date || date === "Date inconnue" || date.length < 7) return "2000-01-01"; // Valeur par défaut si invalide
            return date.length === 7 ? `${date}-01` : date;
        };

        await Promise.all(
            trainers.map(async (trainer) => {
                if (!trainer.id) {
                    console.warn(`Entraîneur ignoré : ID manquant`, trainer);
                    return;
                }

                const clubExists = await pool.query('SELECT id FROM "Club" WHERE id = $1', [trainer.id_club]);

                if (clubExists.rowCount === 0) {
                    console.warn(`Club ID ${trainer.id_club} n'existe pas, entraîneur ignoré`);
                    return;
                }

                await pool.query(`
                    INSERT INTO "Trainer" (id, name, date_of_birth, nationality, contract_start, contract_end, id_club) 
                    VALUES ($1, $2, $3, $4, $5, $6, $7)
                    ON CONFLICT (id) DO NOTHING;
                `, [
                    trainer.id,
                    trainer.name,
                    fixDateFormat(trainer.date_of_birth),
                    trainer.nationality,
                    fixDateFormat(trainer.contract_start),
                    fixDateFormat(trainer.contract_end),
                    trainer.id_club
                ]);
            })
        );

        console.log("Entraîneurs insérés avec succès !");
    } catch (e) {
        console.error("Erreur lors de l'insertion des entraîneurs :", e.message);
    }
};

// Exécuter la récupération des entraîneurs
const main = async () => {
    try {
        const competitionIds = await fetchChampionshipIds();

        if (!competitionIds || competitionIds.length === 0) {
            console.error("Aucune compétition trouvée.");
            return;
        }

        const trainers = await fetchTrainersForTeams(competitionIds);

        if (!trainers || trainers.length === 0) {
            console.warn("Aucun entraîneur récupéré.");
            return;
        }

        await insertTrainer(trainers);

        console.log("Tous les entraîneurs ont été insérés !");
    } catch (e) {
        console.error("Erreur lors de la récupération des entraîneurs :", e.message);
    }
};

main();
