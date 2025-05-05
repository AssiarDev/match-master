// import Database from 'better-sqlite3';

// export const initializeDatabase = (urldb) => {
//     try {
//         // Connexion à la base de données
//         const db = new Database(urldb);
//         console.log('Base de donnée initialisée avec succès.');
//         return db
//     } catch (err) {
//         console.error('Erreur:', err.message);
//     }
// }

import pkg from 'pg';

const { Pool } = pkg;

// Connexion à la db 
const pool = new Pool({
    connectionString: process.env.DATABASE_URL_LOCAL,
    ssl: {
        rejectUnauthorized: false
    }
})

export default pool;


