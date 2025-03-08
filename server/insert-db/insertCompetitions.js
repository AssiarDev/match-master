export const insertCompetition = (db, competitions) => {
    console.log('Objet db:', db);
    if (!db || typeof db.prepare !== 'function') {
        throw new Error('db n\'est pas une instance valide de better-sqlite3.');
    }
    try {
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