import Database from 'better-sqlite3';

export const initializeDatabase = (urldb) => {
    try {
        // Connexion à la base de données
        const db = new Database(urldb);
        console.log('Base de donnée initialisée avec succès.');
        return db
    } catch (err) {
        console.error('Erreur:', err.message);
    }
}


