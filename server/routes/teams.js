import { db } from "../server.js";
import express from "express";

const router = express.Router();

router.get('/teams', (req, res) => {
    try{
        const query = `
    SELECT 
        id,
        name, 
        emblem
    FROM
        club
    `;
    const rows = db.prepare(query).all();
    res.json(rows);
    }catch(e){
        console.error('Erreur lors de l\'exécution de la requête :', e.message);
        res.status(500).send('Erreur serveur');
    }
});

router.get('/teams/:id', (req, res) => {
    const { id } = req.params;
    try {
        const query = `SELECT * FROM club WHERE id = ?`; 
        const team = db.prepare(query).get(id); 
        res.json(team);
    } catch (err) {
        console.error('Erreur lors de la récupération des détails de l\'équipe :', err.message);
        res.status(500).send('Erreur serveur');
    }
});


export {router as teams};

