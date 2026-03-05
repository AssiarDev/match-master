import pool from '../db/db.js';

export const updatePlayers = async (players) => {
  try {
    for (const player of players) {
      const clubExists = await pool.query(
        'SELECT id FROM "Club" WHERE id = $1',
        [player.id_club]
      );

      if (clubExists.rowCount === 0) {
        console.warn(`Club ID ${player.id_club} n'existe pas, joueur ignoré`);
        continue;
      }

      const existingPlayer = await pool.query(
        'SELECT id_club FROM "Player" WHERE id = $1',
        [player.id]
      );

      if (existingPlayer.rowCount > 0) {
        const currentClubId = existingPlayer.rows[0].id_club;

        if (currentClubId !== player.id_club) {
          await pool.query(
            `
                        UPDATE "Player"
                        SET id_club = $1
                        WHERE id = $2
                    `,
            [player.id_club, player.id]
          );

          console.log(
            `🔄 ${player.name} transféré vers club ${player.id_club}`
          );
        }
      } else {
        console.log(`⏩ ${player.name} non présent en base, ignoré`);
      }
    }

    console.log('Mise à jour des joueurs terminée !');
  } catch (e) {
    console.error('Erreur dans updatePlayers :', e.message);
  }
};
