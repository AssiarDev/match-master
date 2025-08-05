import { urlAPI, requestOption } from "./config.js";

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