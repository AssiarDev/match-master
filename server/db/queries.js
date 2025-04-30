import { db } from "../server.js";

export const getTeamByClubName = (clubName) => {
    const query = `
        SELECT 
            p.id AS player_id,
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
            p.id_club = c.id
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

export const getUserFavorites = (userId) => {
    try {
        const stmt = db.prepare(`
            SELECT club.* FROM club
            JOIN users_favorites ON club.id = users_favorites.club_id
            WHERE users_favorites.user_id = ?
        `);

        const favorites = stmt.all(userId);
        return favorites;
    } catch (e) {
        console.error("Erreur lors de la récupération des équipes favorites :", e.message);
        throw e;
    }
};