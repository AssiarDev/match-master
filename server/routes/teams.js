import express from "express";
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

router.get('/teams', async (req, res) => {
    try{
        const teams = await prisma.club.findMany({
            select: { id: true, name: true, emblem: true }
        });

        if (!teams.length) {
            return res.status(404).json({ error: "Aucune équipe trouvée." });
        }

        res.json(teams);

    }catch(e){
        console.error('Erreur lors de l\'exécution de la requête :', e.message);
        res.status(500).send('Erreur serveur');
    }
});

router.get('/teams/:id', async (req, res) => {
    const teamId = parseInt(req.params.id);

    if (isNaN(teamId)) {
        return res.status(400).json({ error: "L'ID de l'équipe est invalide." });
    }

    try {
        const team = await prisma.club.findUnique({
            where: { id: teamId },
            select: { id: true, name: true, emblem: true }
        });

        if (!team) {
            return res.status(404).json({ error: `Aucune équipe trouvée avec l'ID ${teamId}.` });
        }

        res.json(team);

    } catch (err) {
        console.error('Erreur lors de la récupération des détails de l\'équipe :', err.message);
        res.status(500).send('Erreur serveur');
    }
});


export {router as teams};

