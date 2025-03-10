import { db } from "../server.js";
import { fetchChampionshipIds, fetchPlayersForTeams } from "../api/api.js";

export const insertTeam = (players) => {
    try {
        db.exec(`
            CREATE TABLE IF NOT EXISTS players (
            id_player INTEGER PRIMARY KEY,
            name VARCHAR,
            position VARCHAR,
            date_of_birth DATE,
            nationality TEXT NOT NULL,
            id_club INTEGER,
            FOREIGN KEY (id_club) REFERENCES club(id_club)
        )`);

        const insertStmt = db.prepare(`
            INSERT OR IGNORE INTO players (
            id_player,
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

// Récupération des équipes
const competitionIds = await fetchChampionshipIds();

if (!competitionIds || competitionIds.length === 0) {
        console.error("Aucune compétition trouvée.");
        return;
}

const players = await fetchPlayersForTeams(competitionIds);

if (players.length === 0) {
        console.warn("Aucun joueur récupéré.");
        return;
}

insertTeam(players);