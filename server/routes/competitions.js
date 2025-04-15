import { db } from "../server.js";
import express from "express";
import { fetchCompetitionsMatches } from "../api/api.js";

const router = express.Router();

router.get('/competitions', (req, res) => {
    try {
        const query = `
        SELECT 
            name, 
            emblem,
            id
        FROM
            competitions
        WHERE 
            type = 'LEAGUE'
        `
        const rows = db.prepare(query).all();
        res.json(rows);
    } catch (e){
        
        console.log('Erreur lors de l\'execution de la requête :', e.message);
        res.status(500).send('Erreur serveur');
    } 
});

router.get('/competitions/:id/teams', async (req, res) => {
    const competitionId = req.params.id;
    try {
        const query = `
        SELECT
            id, 
            name,
            emblem,
            id_competition
        FROM
            club
        WHERE
            id_competition = ?
        `;
        const rows = db.prepare(query).all(competitionId);
        res.json(rows);

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

export {router as competitions}