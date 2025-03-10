import { db } from "../server.js";
import { fetchAllCompetitions } from "../api/api.js";

export const insertCompetition = (competitions) => {

    try {

        // Création de la table si elle n'existe pas déjà
        db.exec(`
            CREATE TABLE IF NOT EXISTS competitions (
            id_competition INTEGER PRIMARY KEY,
            name VARCHAR,
            place VARCHAR,
            emblem VARCHAR,
            start_date DATE,
            end_date DATE
        )`); 


        const insertStmt = db.prepare(`INSERT INTO competitions (
            id_competition,
            name,
            place,
            emblem,
            start_date,
            end_date
        ) VALUES (?, ?, ?, ?, ?, ?)`);

        // Parcourir et insérer chaque compétition
        competitions.forEach(competition => {
            insertStmt.run(
                competition.id,
                competition.name,
                competition.area.name || null, // Gérer les nulls ou undefined
                competition.emblem || null,    // Idem pour l'emblème
                competition.currentSeason.startDate || null,
                competition.currentSeason.endDate || null
            );
        });

        console.log('Compétitions insérées avec succès dans la base de données.');
    } catch (e){
        console.error(`Erreur lors de l\'insertion des competitions :`, e)
    };
};

// Récupération des competitions
const competitionData = await fetchAllCompetitions();
if(competitionData && Array.isArray(competitionData.competitions)){
    const competitions = competitionData.competitions;
    insertCompetition(db, competitions);
} else {
    console.error('Aucune competition trouvée dans les données. ');
}