import { urlAPI, requestOption } from "./config.js";

export const fetchCompetitionsMatches = async (id) => {
    try {
        const url = `${urlAPI}/competitions/${id}/matches`;
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