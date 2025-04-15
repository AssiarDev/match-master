import express from "express";
import { fetchTabStandings } from "../api/api.js";

const router = express.Router();

router.get('/standings/:id', async (req, res) => {
    const id = req.params.id

    if (!id) {
        return res.status(400).json({ error: 'ID de la compétition manquant ou invalide.' });
    }

    try {
        const result = await fetchTabStandings(id);
        console.log('result standings :', result);

        res.json(result)
    } catch (e){
        console.error('Impossible d\'accéder aux classement de la compétition', e.message)
    }
})

export { router as standings }