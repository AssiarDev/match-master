export const insertTeam = (db, players) => {
    try {
        db.exec(`
            CREATE TABLE IF NOT EXISTS team (
            id_team INTEGER PRIMARY KEY,
            name VARCHAR,
            position VARCHAR,
            date_of_birth DATE,
            nationality TEXT NOT NULL,
            id_club INTEGER,
            FOREIGN KEY (id_club) REFERENCES club(id_club)
        )`);

        const insertStmt = db.prepare(`
            INSERT OR IGNORE INTO team (
            id_team,
            name,
            position,
            date_of_birth,
            nationality,
            id_club
        ) VALUES (?, ?, ?, ?, ?, ?)`);


        players.forEach(player => {
            if (!player.id || !player.name || !player.position || !player.date_of_birth || !player.nationality) {
                console.warn('Données de joueur incomplètes :', player);
                return;
            }
            insertStmt.run(
                player.id,
                player.name,
                player.position,
                player.date_of_birth,
                player.nationality,
                player.id_club
            )
        });

        console.log('Equipe insérées avec succès dans la base de donnée.')
    } catch (e){
        console.error('Erreur lors de l\'insertion des équipes: ', e.message)
    };
};