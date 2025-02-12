import express from 'express';
import { endpointChampionships, fetchAllCompetitions, fetchCompetitions, fetchTeams } from './api/api.js';
import cors from 'cors';

const app = express();
const port = process.env.PORT;
const urlServerClient = process.env.URL_SERVER_CLIENT;

const corsOptions = {
    origin: urlServerClient
};
app.use(cors(corsOptions))
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello from Express');
});

app.get('/competitions', async (req, res) => {
    try{
        const result = await fetchAllCompetitions();
        console.log('Data fetched:', result)
        res.send(result);
    } catch(e){
        console.error('error', e)
        res.status(500).send('Error fetching data')
    }
})
  

app.get('/competitions/FL1/teams', async (req, res) => {
    try{
        const result = await fetchCompetitions(endpointChampionships.ligue1);
        console.log('Data fetched:', result)
        res.send(result);
    } catch(e){
        console.error('error', e)
        res.status(500).send('Error fetching data')
    }
})

app.get('/competitions/PL/teams', async (req, res) => {
    try{
        const result = await fetchCompetitions(endpointChampionships.eng);
        res.send(result);
    } catch(e){
        console.error('error', e)
        res.status(500).send('Error fetching data')
    }
})

app.get('/competitions/:competitionId/teams', async (req, res) => {
    const {competitionId} = req.params
    try{
        const result = await fetchTeams(competitionId);
        res.send(result);
    } catch(e){
        console.error('error', e)
        res.status(500).send('Error fetching data')
    }
})


app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`)
})