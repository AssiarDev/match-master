import pool from '../db/db.js';
import { fetchChampionshipIds } from '../service/api/competitionsApi.js';
import { fetchTrainersForTeams } from '../service/api/teamsApi.js';

const fixDateFormat = (date) => {
    if (!date || date === "Date inconnue" || date.length < 7) return "2000-01-01";
    return date.length === 7 ? `${date}-01` : date;
};

export const updateTrainer = async (trainers) => {
    try {
        if (!trainers || trainers.length === 0) {
            console.warn("Aucun entraîneur à mettre à jour.");
            return;
        }

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

                const existingTrainer = await pool.query('SELECT id_club, contract_start, contract_end FROM "Trainer" WHERE id = $1', [trainer.id]);

                if (existingTrainer.rowCount === 0) {
                    console.log(`Entraîneur ${trainer.name} non trouvé, aucune mise à jour.`);
                    return;
                }

                const current = existingTrainer.rows[0];
                const newStart = fixDateFormat(trainer.contract_start);
                const newEnd = fixDateFormat(trainer.contract_end);

                if (
                    current.id_club !== trainer.id_club ||
                    current.contract_start !== newStart ||
                    current.contract_end !== newEnd
                ) {
                    await pool.query(`
                        UPDATE "Trainer"
                        SET id_club = $1,
                            contract_start = $2,
                            contract_end = $3
                        WHERE id = $4;
                    `, [
                        trainer.id_club,
                        newStart,
                        newEnd,
                        trainer.id
                    ]);
                    console.log(`Entraîneur ${trainer.name} mis à jour.`);
                } else {
                    console.log(`Entraîneur ${trainer.name} déjà à jour.`);
                }
            })
        );

        console.log("Mise à jour des entraîneurs terminée !");
    } catch (e) {
        console.error("Erreur lors de la mise à jour des entraîneurs :", e.message);
    }
};

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

        await updateTrainer(trainers);
    } catch (e) {
        console.error("Erreur dans le script de mise à jour :", e.message);
    }
};

main();