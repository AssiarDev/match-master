import { db } from "../server.js";
import { fetchChampionshipIds, fetchTeams } from "../api/api.js";

export const insertClub = (teams, competitionData) => {
    try{
        db.exec(`
            CREATE TABLE IF NOT EXISTS club (
            id_club INTEGER PRIMARY KEY,
            name VARCHAR, 
            country VARCHAR,
            id_competition INTEGER,
            emblem VARCHAR,
            stadium TEXT,
            FOREIGN KEY (id_competition) REFERENCES competitions(id_competition)
            )`);

        const insertStmt = db.prepare(`
            INSERT OR IGNORE INTO club (
            id_club,
            name,
            country,
            id_competition,
            emblem, 
            stadium
        ) VALUES (?, ?, ?, ?, ?, ?)`);

        const competitionId = competitionData.competitions.id

        teams.forEach(team => {
            insertStmt.run(
                team.id,
                team.name,
                team.area.name,
                competitionId,
                team.crest,
                team.venue
            )
        });

        console.log('Club insérées avec succès dans la base de données.');
    } catch(e){
        console.error('Erreur lors de l\'insertion des clubs: ', e);
    }
};

// Récupération des clubs
const championshipIds = await fetchChampionshipIds();
const clubData = await fetchTeams(championshipIds);

clubData.forEach((teamsData, index) => {
        const competitionsId = championshipIds[index];
        insertClub(teamsData.teams, {competitions: {id: competitionsId}})
})