import express from 'express';
import { 
    endpointChampionships, 
    fetchAllCompetitions,  
    // fetchChampionshipIds, 
    fetchCompetitions, 
    fetchCompetitionsMatches, 
    fetchTeams,
    // fetchTrainersForTeams,
    // fetchPlayersForTeams 
} from './api/api.js';
import cors from 'cors';
import { initializeDatabase } from './db/db.js';
// import { insertTrainer } from './insert-db/insertTrainer.js';
// import { insertTeam } from './insert-db/insertTeams.js';
//import { insertCompetition } from './insert-db/insertCompetitions.js';
//import { insertClub } from './insert-db/insertClub.js';

const app = express();
const port = process.env.PORT;
const urlServerClient = process.env.URL_SERVER_CLIENT;
const urlDb = process.env.URL_DB;

// Gerer la base de donnée 
const main = async () => {
    try{
        // Intégration de ma db
        const db = initializeDatabase(urlDb);

        // Récupération des competitions
        // const competitionData = await fetchAllCompetitions();
        // if(competitionData && Array.isArray(competitionData.competitions)){
        //     const competitions = competitionData.competitions;

        //     insertCompetition(db, competitions);
        // } else {
        //     console.error('Aucune competition trouvée dans les données. ');
        // }

        // Récupération des clubs
        // const championshipIds = await fetchChampionshipIds();
        // const clubData = await fetchTeams(championshipIds);

        // clubData.forEach((teamsData, index) => {
        //     const competitionsId = championshipIds[index];
        //     insertClub(db, teamsData.teams, {competitions: {id: competitionsId}})
        // })

        // Récupération des équipes
        // const competitionIds = await fetchChampionshipIds();

        // if (!competitionIds || competitionIds.length === 0) {
        //     console.error("Aucune compétition trouvée.");
        //     return;
        // }

        // const players = await fetchPlayersForTeams(competitionIds);

        // if (players.length === 0) {
        //     console.warn("Aucun joueur récupéré.");
        //     return;
        // }

        // insertTeam(db, players);

        // Récupération des entraineurs 
        // const competitionIds = await fetchChampionshipIds();

        // if (!competitionIds || competitionIds.length === 0) {
        //     console.error("Aucune compétition trouvée.");
        //     return;
        // };
        
        // const trainers = await fetchTrainersForTeams(competitionIds);

        // if (trainers.length === 0) {
        //     console.warn("Aucun joueur récupéré.");
        //     return;
        // }; 

        // insertTrainer(db, trainers)

        const getTeamByClubName = (db, clubName) => {
            const query = `
                SELECT 
                    p.id_player,
                    p.name AS player_name,
                    p.position,
                    p.date_of_birth,
                    p.nationality,
                    c.name AS club_name
                FROM 
                    players p
                JOIN 
                    club c
                ON 
                    p.id_club = c.id_club
                WHERE 
                    c.name = ?;
            `;
        
            try {
                const team = db.prepare(query).all(clubName);
                return team;
            } catch (error) {
                console.error("Erreur lors de la récupération de l'équipe :", error.message);
                throw error;
            }
        };
        
        const psgTeam = getTeamByClubName(db, "Paris Saint-Germain FC");
        console.log("Équipe du PSG :", psgTeam);

        db.close();
        console.log('Base de données fermée avec succès.')
    } catch (e) {
        console.error('Erreur dans le processus principal :', e.message)
    }

};

main();

const corsOptions = {
    origin: [urlServerClient, `http://localhost:${port}`]
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