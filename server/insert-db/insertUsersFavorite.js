import { db } from "../server.js";

export const insertUsersFavorite = (userId, clubId) => {
    try {
        db.exec(`
            CREATE TABLE IF NOT EXISTS users_favorites (
            user_id INT UNSIGNED NOT NULL,
            club_id INT UNSIGNED NOT NULL,
            PRIMARY KEY (user_id, club_id),
            FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
            FOREIGN KEY (club_id) REFERENCES club (id) ON DELETE CASCADE
            )`);

        const insertStmt = db.prepare(`
            INSERT OR IGNORE INTO users_favorites (
            user_id, 
            club_id
        ) VALUES (?, ?)`);

        insertStmt.run(userId, clubId);

        return { success: true, message: `Club ${clubId} ajouté aux favoris de l'utilisateur ${userId}` };
        
    } catch(e){
        console.error('Erreur lors de la création de la table', e.message)
    }
}

//insertUsersFavorite(1, 524);