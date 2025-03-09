import fetch from 'node-fetch';
import 'dotenv/config';

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

export const endpointChampionships = {
    brasil: "BSA/teams",
    engC: "ELC/teams",
    eng: "PL/teams",
    ucl: "CL/teams",
    europeanChampionship: "EC/teams",
    ligue1: "FL1/teams",
    bund: "BL1/teams",
    serieA: "SA/teams",
    erediv: "DED/teams",
    primeraLiga: "PPL/teams",
    copaLibertadores: "CLI/teams",
    liga: "PD/teams",
    worldCup: "WC/teams"
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

export const fetchCompetitions = async (endpoint) => {
    try {
        const url = `${urlAPI}/competitions/${endpoint}`;
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
        const allPlayers = []; // Stockage global de tous les joueurs

        // Construire les URLs pour récupérer les équipes associées aux compétitions
        const urls = competitionIds.map(id => `${urlAPI}/competitions/${id}/teams`);

        // Récupérer les équipes pour chaque compétition
        const responses = await Promise.all(
            urls.map(url => fetch(url, requestOption))
        );

        // Vérification et conversion des réponses en JSON
        const results = await Promise.all(
            responses.map(response => {
                if (!response.ok) {
                    console.log('Error, API failed');
                    throw new Error('Error, API failed');
                }
                return response.json();
            })
        );

        // Parcourir les données des équipes récupérées
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


export const fetchCompetitionsMatches = async (id) => {
    try {
        const url = `${urlAPI}/competitions/${id}/matches?status=SCHEDULED`;
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

