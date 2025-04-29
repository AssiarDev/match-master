import express from 'express';
import { endpointChampionships,  fetchCompetitions, fetchTabStandings } from './api/api.js';
import cors from 'cors';
import { initializeDatabase } from './db/db.js';
import { teams } from './routes/teams.js';
import { competitions } from './routes/competitions.js';
import { standings } from './routes/standings.js';
import { users } from './routes/users.js';

const app = express();
const port = process.env.PORT;
const urlServerClient = process.env.URL_SERVER_CLIENT;
const urlDb = process.env.URL_DB;

// Intégration de ma db
export const db = initializeDatabase(urlDb);

const corsOptions = {
    origin: [urlServerClient, `http://localhost:${port}`]
};
app.use(cors(corsOptions))
app.use(express.json());
app.use(teams);
app.use(competitions);
app.use(standings)
app.use(users)

app.get('/', (req, res) => {
    res.send('Hello from Express');
});
  
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

// app.get('/competitions/:competitionId/teams', async (req, res) => {
//     const {competitionId} = req.params
//     try{
//         const result = await fetchTeamDetails(competitionId);
//         res.send(result);
//     } catch(e){
//         console.error('error', e)
//         res.status(500).send('Error fetching data')
//     }
// });


app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`)
})