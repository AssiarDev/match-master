import express from 'express';
import { fetchChampionshipIds } from '../service/api/leagues.js';
import { fetchPlayersForTeams } from '../service/api/teamsApi.js';
import { fetchTrainersForTeams } from '../service/api/teamsApi.js';
import { updatePlayers } from '../update-db/updatePlayers.js';
import { updateTrainer } from '../update-db/updateTrainers.js';

const router = express.Router();

router.post('/cron/update-db/players', async (req, res) => {
  try {
    const competitionId = await fetchChampionshipIds();
    const players = await fetchPlayersForTeams(competitionId);

    if (!players || players.length === 0) {
      return res.status(400).send('Aucun joueur récupéré');
    }

    await updatePlayers(players);
    res.status(200).send('Mise à jour des joueurs éffectuée');
  } catch (e) {
    console.error('Erreur mise à jour', e.message);
    res
      .status(500)
      .send('Une erreur est survenue lors de la mise à jour des joueurs.');
  }
});

router.post('/cron/update-db/trainers', async (req, res) => {
  try {
    const competitionId = await fetchChampionshipIds();
    const trainers = await fetchTrainersForTeams(competitionId);

    if (!trainers || trainers.length === 0) {
      return res.status(400).send('Aucun entraineur récupéré');
    }

    await updateTrainer(trainers);
    res.status(200).send('Mise à jour éffectuée avec succès');
  } catch (e) {
    console.error('Erreur lors de la mise à jour', e.message);
    res
      .status(500)
      .send('Une erreur est survenue lors de la mise à jour des entraineurs.');
  }
});

export { router as update };
