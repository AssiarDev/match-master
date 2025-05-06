// import { db } from "../server.js";
import bcrypt from 'bcryptjs';

export const insertUser = (username, email, password) => {
    try {
        db.exec(`
            CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username VARCHAR(255),
            email VARCHAR(255),
            password VARCHAR(255)
            )`);
        
        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(password, salt);

        const insertStmt = db.prepare(`
            INSERT OR IGNORE INTO users (
            username, 
            email, 
            password
        ) VALUES (?, ?, ?)`);

        const result = insertStmt.run(username, email, hashedPassword);

        return result

    } catch(e){
        console.error('Erreur lors de la création de la table users: ', e.message)
        console.log(e.stack)
    }
}

//insertUser();