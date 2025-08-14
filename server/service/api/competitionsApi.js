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
            throw new Error(`Erreur HTTP ${response.status}`);
        }

        const data = await response.json();

        if (!Array.isArray(data.competitions)) {
            console.error('Format inattendu : "competitions" n’est pas un tableau');
            return [];
        }

        return data.competitions.map(comp => comp.id).filter(Boolean);
    } catch (error) {
        console.error('Erreur lors de la récupération des IDs de compétitions :', error.message);
        return [];
    }
};