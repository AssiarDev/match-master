import Database from 'better-sqlite3';

export const initializeDatabase = (urldb) => {
    try {
        // Connexion à la base de données
        const db = new Database(urldb);
    
        // Création de la table si elle n'existe pas déjà
        db.exec(`
            CREATE TABLE IF NOT EXISTS competitions (
            id_competition INTEGER PRIMARY KEY,
            name VARCHAR,
            place VARCHAR,
            emblem VARCHAR,
            start_date DATE,
            end_date DATE
            )`); 

        // Lecture des données
        const rows = db.prepare('SELECT * FROM competitions').all();
        rows.forEach(row => {
            console.log(row);
        });
        console.log('Base de données fermée avec succès.');
        return db
    } catch (err) {
        console.error('Erreur:', err.message);
    }
}
