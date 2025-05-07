import express from "express";
import { fetchChampionshipIds, fetchCompetitionsMatches, fetchMatchesByCompetitions } from "../api/api.js";
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient()

router.get('/competitions', async (req, res) => {
    try {
        const competitions = await prisma.competition.findMany({
            where: { type: 'LEAGUE' },
            select: { id: true, name: true, emblem: true }
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
        const result = await fetchChampionshipIds();
        console.log('result ID :', result);
        res.json(result);
    } catch (e){
        console.error('Erreur, impossible de récupérer les ids', e.message);
        res.status(500).send('Error fetching data')
    }
});

router.get('/competitions/matches', async (req, res) => {
    try {
        // Étape 1 : Récupérer les IDs des compétitions depuis la première route
        const idsResponse = await fetch(`${req.protocol}://${req.get('host')}/competitionsId`);
        if (!idsResponse.ok) {
            throw new Error(`Erreur lors de la récupération des IDs : ${idsResponse.statusText}`);
        }

        const competitionIds = await idsResponse.json();
        console.log('IDs des compétitions récupérés:', competitionIds);

        // Étape 2 : Appeler fetchMatchesByCompetitions pour chaque ID de compétition
        const allMatches = [];
        for (const id of competitionIds) {
            try {
                const matches = await fetchMatchesByCompetitions([id]);
                allMatches.push(...matches);
            } catch (error) {
                console.error(`Erreur lors de la récupération des matchs pour la compétition ${id}:`, error.message);
            }
        }

        // Étape 3 : Retourner tous les matchs combinés
        console.log('Tous les matchs combinés :', allMatches);
        res.json(allMatches);
    } catch (error) {
        console.error('Erreur globale lors de la récupération des matchs:', error.message);
        res.status(500).json({ error: 'Une erreur est survenue lors de la récupération des matchs' });
    }
});


export {router as competitions}