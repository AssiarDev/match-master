import express from 'express';
import { endpointChampionships, fetchCompetitions } from './api/api.js';

const app = express();
const port = 3000;

app.use(express.json());

app.get('/competitions/FL1/teams', async (req, res) => {
    try{
        const result = await fetchCompetitions(endpointChampionships.ligue1);
        console.log(result)
        res.send(result);
    } catch(e){
        console.error('error', e)
        res.status(500).send('Error fetching data')
    }
})

app.get('/competitions/PL/teams', async (req, res) => {
    try{
        const result = await fetchCompetitions(endpointChampionships.eng);
        console.log(result)
        res.send(result);
    } catch(e){
        console.error('error', e)
        res.status(500).send('Error fetching data')
    }
})


app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`)
})