// import { db } from "../server.js";
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken';

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

export const getAllUsers = () => {
    try {
        const stmt = db.prepare(`SELECT * FROM users`);
        const users = stmt.all();
        return users;
    } catch(e){
        console.error('Erreur lors de la récupération des utilisateurs', e.message)
    }
}

export const deleteUsers = (id) => {
    try {

        const stmt = db.prepare('DELETE FROM users WHERE id = ?')
        const result = stmt.run(id);
        return result;

    } catch (e){
        console.error('Erreur lors de la suppression des utilisateurs', e.message)
    }
}

export const updateUsers = (id, data) => {
    try {
        const stmt = db.prepare('UPDATE users SET username = ?, email = ? WHERE id = ?');
        const result = stmt.run(data.username, data.email, id)
        return result.changes > 0 ? { message: "Utilisateur mis à jour avec succès" } : { error: "Utilisateur introuvable" };

    } catch (e){
        console.error('Erreur lors de la mise à jour de l\'utilisateur', e.message)
    }
};

export const login = async (email, password) => {
    try {
        const stmt = db.prepare('SELECT * FROM users WHERE email = ?');
        const user = await stmt.get(email);

        if (!user) {
            console.error('Utilisateur non trouvé.');
            return false;
        }

        const isPasswordValid = await bcrypt.compareSync(password, user.password);
        if (!isPasswordValid) {
            console.error('Mot de passe incorrect.');
            return { success: false, message: 'Mot de passe incorrect' }
        };

        // Générer un token 
        const token = jwt.sign(
            { id: user.id, email: user.email, username: user.username },
            process.env.SECRET_KEY,
            { expiresIn: "1h" } 
        );

        console.log('Connexion réussie.');
        return { success: true, token };

    } catch (e){
        console.error('Erreur lors de la connexion:', e.message);
        console.log(e.stack);
        return false; 
    }
}