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
        console.log('Championship IDs:', ids);
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

export const fetchTeamsId = async (id) => {
    try {
        const url = `${urlAPI}/v4/teams/${id}`;
        const response = await fetch(url, requestOption)
        if(!response.ok){
            throw new Error('Error, api failed');
        }
        const result = await response.json();
        return result;
    } catch {
        console.error('Erreur lors de l\'appel de l\'API', error);
        throw error
    }
}
