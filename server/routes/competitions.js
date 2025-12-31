import express from "express";
import { fetchCompetitionsMatches, fetchMatchesByCompetitions } from "../service/api/matchesApi.js";
import { PrismaClient } from '@prisma/client';
import { updateSeasonCount } from "../update-db/updateSeasonCount.js";
import { getCompetitionById } from "../service/database/competitions.js";

const router = express.Router();
const prisma = new PrismaClient()

router.get('/competitions', async (req, res) => {
    try {
        const competitions = await prisma.competition.findMany({
            where: { type: 'LEAGUE' },
            select: { id: true, name: true, emblem: true, nbSeasons: true },
            orderBy: {
                nbSeasons: 'desc'
            }
        });

        res.json(competitions)
    } catch (e){
        console.log('Erreur lors de l\'execution de la requête :', e.message);
        res.status(500).send('Erreur serveur');
    } 
});

router.get('/competitions/:id/teams', async (req, res) => {
    const competitionId = parseInt(req.params.id);
    try {
        const teams = await prisma.club.findMany({
            where: { id_competition: competitionId },
            select: { id: true, name: true, emblem: true, id_competition: true }
        });

        if (!teams.length) {
            return res.status(404).json({ error: `Aucune équipe trouvée pour la compétition ${competitionId}.` });
        }

        res.json(teams);
    } catch (e){
        console.error('Erreur lors de l\'execution de la requête :', e.message);
        res.status(500).send('Erreur serveur')
    } 
});

router.get('/competitions/:id/matches', async (req, res) => {
    const competitionCode = req.params.id;
    const status = req.query.status
    try{
        const result = await fetchCompetitionsMatches(competitionCode, status);
        console.log('Data fetched:', result)
        res.send(result);
    } catch(e){
        console.error('error', e)
        res.status(500).send('Error fetching data')
    }
});

router.get('/competitionsId', async (req, res) => {
    try {
        const competitionIds = await prisma.competition.findMany({
            select: { id: true }
        });

        res.json(competitionIds);
    } catch (e) {
        console.error('Erreur lors de la récupération des IDs', e.message);
        res.status(500).send('Error fetching data');
    }
})

router.get('/competitions/matches', async (req, res) => {
    try {
        const ids = await getCompetitionById()
        if (!ids.ok) {
            throw new Error(`Erreur lors de la récupération des IDs : ${ids.statusText}`);
        }

        const competitionIds = await ids.json();

        const matchesArrays = await Promise.all(
            competitionIds.map(id =>
                fetchMatchesByCompetitions([id]).catch(() => [])
            )
        );

        res.json(matchesArrays.flat());

    } catch (error) {
        console.error('Erreur globale lors de la récupération des matchs:', error.message);
        res.status(500).json({ error: 'Une erreur est survenue lors de la récupération des matchs' });
    }
});

router.post('/competitions/update-season-count', async (req, res) => {
    try {
        await updateSeasonCount();
        res.status(200).send('Mise à jour terminé');
    } catch(e){
        console.error('Erreur lors de la mise à jour', e.message)
        res.status(500).send('Erreur serveur')
    }
});


export {router as competitions}