import express from 'express';
import { topScorers } from '../api/api.js';

const router = express.Router(); 

router.get('/scorers/:id', async (req, res) => {

    const id = req.params.id;
    try {
        const result = await topScorers(id)
        res.json(result)
    } catch(e){
        console.error('Erreur, impossible de récupérer les meilleurs buteurs', e.message)
        res.status(500).send('Error fetching data')
    }
});

export { router as scorers }