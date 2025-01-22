import fetch from 'node-fetch';
import 'dotenv/config';

// Appel de l'api
const token = process.env.API_TOKEN;

const headers = new Headers();
headers.append("X-Auth-Token", token);

const requestOption = {
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

export const fetchCompetitions = async (endpoint) => {
    try {
        const url = `https://api.football-data.org/v4/competitions/${endpoint}`;
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