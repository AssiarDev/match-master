import { db } from "../server.js";

const main = async () => {
    try{
        const getTeamByClubName = (clubName) => {
            const query = `
                SELECT 
                    p.id_player,
                    p.name AS player_name,
                    p.position,
                    p.date_of_birth,
                    p.nationality,
                    c.name AS club_name
                FROM 
                    players p
                JOIN 
                    club c
                ON 
                    p.id_club = c.id_club
                WHERE 
                    c.name = ?;
            `;
        
            try {
                const team = db.prepare(query).all(clubName);
                return team;
            } catch (error) {
                console.error("Erreur lors de la récupération de l'équipe :", error.message);
                throw error;
            }
        };
        
        const psgTeam = getTeamByClubName("Paris Saint-Germain FC");
        console.log("Équipe du PSG :", psgTeam);

        db.close();
        console.log('Base de données fermée avec succès.')
    } catch (e) {
        console.error('Erreur dans le processus principal :', e.message)
    }

};

main();