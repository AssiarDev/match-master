export const insterTrainer = (db, trainers) => {
    try {
        db.exec(`
            CREATE TABLE IF NOT EXISTS trainers (
            id_trainer INTEGER PRIMARY KEY,
            name VARCHAR,
            date_of_birth DATE,
            nationality TEXT NOT NULL,
            contract_start DATE,
            contract_end DATE,
            id_club INTEGER,
            FOREIGN KEY (id_club) REFERENCES club(id_club)
        )`);

        const insertStmt = db.prepare(`
            INSERT OR IGNORE INTO trainers (
            id_trainer,
            name, 
            date_of_birth,
            nationality,
            contract_start,
            contract_end,
            id_club
            ) VALUES (?, ?, ?, ?, ?, ?, ?)`);

        trainers.forEach(trainer => {
            if(!trainer.id || !trainer.name || !trainer.date_of_birth || !trainer.nationality || !trainer.contract_start || !trainer.contract_end){
                console.warn('Donnée de l\'entraineur incomplète : ', trainer);
                return;
            }

            insertStmt.run(
                trainer.id, 
                trainer.name,
                trainer.date_of_birth,
                trainer.nationality,
                trainer.contract.start,
                trainer.contract.end,
                trainer.id_club
            )
        });

        console.log('Equipe insérées avec succès dans la base de donnée.')
    } catch(e){
        console.error('Erreur lors de l\'insertion des entraineurs: ', e.message)
    }
};