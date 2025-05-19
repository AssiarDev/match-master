import fetch from 'node-fetch';
import dotenv from 'dotenv';

const envFile = process.env.NODE_ENV === "production" ? ".env.production" : ".env.development";
dotenv.config({ path: envFile });

// Appel de l'api
const token = process.env.API_TOKEN;
export const urlAPI = process.env.URL_API;

const headers = new Headers();
headers.append("X-Auth-Token", token);
headers.append('Content-Type', 'application/json');
//headers.append("X-Unfold-Goals", "true");

export const requestOption = {
    method: "GET",
    headers: headers
};

export const fetchAllCompetitions = async () => {
    try {
        const url = `${urlAPI}/competitions`;
        const response = await fetch(url, requestOption);
        if(!response.ok){
            console.log('Error, api failed');
            throw new Error('Error, api failed');
        }
        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Erreur lors de l\'appel de l\'API', error)
    }
}

export const fetchChampionshipIds = async () => {
    try {
        const response = await fetch(`${urlAPI}/competitions`, requestOption);
        if (!response.ok) {
            throw new Error('Impossible d\'accéder aux compétitions');
        }
        const text = await response.text();
        if (text.startsWith('<')) {
            console.error('Received HTML response instead of JSON:', text);
            return [];
        }
        const result = JSON.parse(text);
        const ids = result.competitions.map(comp => comp.id);
        // console.log('Championship IDs:', ids);
        return ids;
    } catch (error) {
        console.error('Error fetching championship IDs: ', error);
        return [];
    }
};

export const fetchTeams = async (ids) => {
    try {
        const urls = ids.map(id => `${urlAPI}/competitions/${id}/teams`);

        const responses = await Promise.all(
            urls.map(url => fetch(url, requestOption))
        );

        const results = await Promise.all(
            responses.map(response => {
                if(!response.ok){
                    console.log('Error, api failed');
                    throw new Error('Error, api failed');
                }
                return response.json();
            })
        ) 
        return results;
    } catch (error) {
        console.error('Erreur lors de l\'appel de l\'API', error);
        throw error
    }
};

export const fetchPlayersForTeams = async (competitionIds) => {
    try {
        const allPlayers = []; 

        const urls = competitionIds.map(id => `${urlAPI}/competitions/${id}/teams`);

        const responses = await Promise.all(
            urls.map(url => fetch(url, requestOption))
        );

        const results = await Promise.all(
            responses.map(response => {
                if (!response.ok) {
                    console.log('Error, API failed');
                    throw new Error('Error, API failed');
                }
                return response.json();
            })
        );

        results.forEach(result => {

            if (result.teams && result.teams.length > 0) {
                result.teams.forEach(team => {
                    const clubId = team.id

                    if (team.squad && team.squad.length > 0) {
                        const players = team.squad.map(player => ({
                            id: player.id,
                            name: player.name,
                            position: player.position,
                            date_of_birth: player.dateOfBirth,
                            nationality: player.nationality,
                            id_club: clubId 
                        }));

                        console.log(`Joueurs pour l'équipe ${team.name}:`, players);
                        allPlayers.push(...players); 
                    } else {
                        console.log(`Pas de squad trouvé pour l'équipe ${team.name} (ID ${team.id}).`);
                    }
                });
            } else {
                console.log('Aucune équipe trouvée dans les données du résultat.');
            }
        });

        return allPlayers; 
    } catch (error) {
        console.error('Erreur lors de l\'appel de l\'API pour récupérer les joueurs :', error.message);
        throw error;
    }
};

export const fetchTrainersForTeams = async (competitionIds) => {
    try {
        const allTrainers = []; 

        const urls = competitionIds.map(id => `${urlAPI}/competitions/${id}/teams`);

        const responses = await Promise.all(
            urls.map(url => fetch(url, requestOption))
        );

        const results = await Promise.all(
            responses.map(response => {
                if (!response.ok) {
                    console.log('Error, API failed');
                    throw new Error('Error, API failed');
                }
                return response.json();
            })
        );

        results.forEach(result => {

            if (result.teams && result.teams.length > 0) {
                result.teams.forEach(team => {
                    const clubId = team.id

                    if (team.coach) {
                        const trainers = {
                            id: team.coach.id,
                            name: team.coach.name,
                            date_of_birth: team.coach.dateOfBirth,
                            nationality: team.coach.nationality,
                            contract_start: team.coach.contract.start || 'Date inconnue',
                            contract_end: team.coach.contract.until || 'Date inconnue',
                            id_club: clubId 
                        };

                        console.log(`Entraineur pour l'équipe ${team.name}:`, trainers);
                        allTrainers.push(trainers); 
                    } else {
                        console.log(`Pas d'entraineur trouvé pour l'équipe ${team.name} (ID ${team.id}).`);
                    }
                });
            } else {
                console.log('Aucune entraineur trouvé dans les données du résultat.');
            }
        });

        console.log('allTrainers: ', allTrainers)

        return allTrainers; 
    } catch (error) {
        console.error('Erreur lors de l\'appel de l\'API pour récupérer les entraineurs :', error.message);
        throw error;
    }
};

export const fetchCompetitionsMatches = async (id) => {
    try {
        const url = `${urlAPI}/competitions/${id}/matches`;
        console.log('url: ', url)
        const response = await fetch(url, requestOption);
        if(!response.ok){
            console.log('Error, api failed');
            throw new Error('Error, api failed');
        }
        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Erreur lors de l\'appel de l\'API', error)
        throw error;
    }
};

export const fetchMatchesByCompetitions = async (competitionIds) => {
    try {
        if (!competitionIds || !Array.isArray(competitionIds)) {
            throw new Error('Les IDs des compétitions doivent être fournis sous forme de tableau.');
        }

        // Construire les URLs pour chaque compétition
        const urls = competitionIds.map(
            id => `${urlAPI}/competitions/${id}/matches`
        );

        // Effectuer les requêtes en parallèle
        const responses = await Promise.all(
            urls.map(url =>
                fetch(url, requestOption)
            )
        );

        const jsonResults = await Promise.all(
            responses.map(response => response.json())
        );

        // Combiner les résultats
        const allMatches = jsonResults.flatMap(result => result.matches || []);
        console.log('Tous les matchs récupérés :', allMatches);

        return allMatches;
    } catch (error) {
        console.error('Erreur lors de la récupération des matchs :', error);
        return [];
    }
};


export const fetchTabStandings = async (id) => {
    try {
        const url = `${urlAPI}/competitions/${id}/standings`;
        const response = await fetch(url, requestOption);
        if(!response.ok){
            throw new Error('Error api failed')
        }
        const result = await response.json();
        console.log('result :', result)

        const standings = result.standings;
        const table = standings[0].table
        return table
    } catch (e){
        console.error('Erreur impossible de récupérer les données :', e.message)
    }
}

export const topScorers = async (id) => {
    try {
        const url= `${urlAPI}/competitions/${id}/scorers`;
        const response = await fetch(url, requestOption);
        if(!response.ok){
            throw new Error('Error api failed')
        }

        const result = await response.json();
        const scorers = result.scorers;

        return scorers
    } catch(e){
        console.error('Erreur impossible de récupérer les données :', e.message)
    }
}

