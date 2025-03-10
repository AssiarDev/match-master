import express from 'express';
import { 
    endpointChampionships, 
    fetchAllCompetitions,  
    fetchCompetitions, 
    fetchCompetitionsMatches, 
    fetchTeams,
} from './api/api.js';
import cors from 'cors';
import { initializeDatabase } from './db/db.js';

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

app.get('/', (req, res) => {
    res.send('Hello from Express');
});

app.get('/teams', (req, res) => {
    try{
        const query = `
    SELECT 
        id_club,
        name, 
        emblem
    FROM
        club
    `;
    const rows = db.prepare(query).all();
    res.json(rows);
    db.close()
    }catch(e){
        console.error('Erreur lors de l\'exécution de la requête :', error.message);
        res.status(500).send('Erreur serveur');
    }
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

app.get('/competitions/:id/matches', async (req, res) => {
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

app.get('/v4/competitions/:id/teams', async (req, res) => {
    const teamId = req.params.id;
    try {
        const result = await fetchTeams(teamId);
        res.send(result);
    } catch (e){
        console.error('error', e);
        res.status(500).send('Error fetching data')
    }
});

app.get('/competitions/:competitionId/teams', async (req, res) => {
    const {competitionId} = req.params
    try{
        const result = await fetchTeamDetails(competitionId);
        res.send(result);
    } catch(e){
        console.error('error', e)
        res.status(500).send('Error fetching data')
    }
});


app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`)
})