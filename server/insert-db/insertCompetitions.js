import { db } from "../server.js";
import { fetchAllCompetitions } from "../api/api.js";

export const insertCompetitions = (db, competitions) => {

    try {

        // Création de la table si elle n'existe pas déjà
        db.exec(`
            CREATE TABLE IF NOT EXISTS competitions (
            id INTEGER PRIMARY KEY,
            name VARCHAR,
            place VARCHAR,
            emblem VARCHAR,
            start_date DATE,
            end_date DATE,
            type VARCHAR
        )`); 


        const insertStmt = db.prepare(`INSERT INTO competitions (
            id,
            name,
            place,
            emblem,
            start_date,
            end_date,
            type
        ) VALUES (?, ?, ?, ?, ?, ?, ?) `);

        // Parcourir et insérer chaque compétition
        competitions
        .filter(competition => competition.type === 'LEAGUE')
        .forEach(competition => {
            insertStmt.run(
                competition.id,
                competition.name,
                competition.area.name || null, // Gérer les nulls ou undefined
                competition.emblem || null,    // Idem pour l'emblème
                competition.currentSeason.startDate || null,
                competition.currentSeason.endDate || null,
                competition.type
            );
        });

        console.log('Compétitions insérées avec succès dans la base de données.');
    } catch (e){
        console.error(`Erreur lors de l\'insertion des competitions :`, e)
    };
};

// Récupération des league
const main = async () => {
    const competitionData = await fetchAllCompetitions();
    if(competitionData && Array.isArray(competitionData.competitions)){
        const competitions = competitionData.competitions;
        insertCompetitions(db, competitions);
    } else {
        console.error('Aucune competition trouvée dans les données. ');
    }
}

main();