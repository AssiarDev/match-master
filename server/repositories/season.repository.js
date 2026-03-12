import { urlAPI, token } from "../service/api/config.js";

export class SeasonRepository {
     
    constructor(){
        this.baseUrl = urlAPI
        this.token = token
    }

    async fetchSeasonsTeams(seasonId){
        try {
            const url = `${this.baseUrl}/seasons/${seasonId}?api_token=${this.token}&include=teams`;
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(` API Error fetchSeasonsTeams : ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error("Erreur lors de l'appel API :", error);
            throw error
        }
    }

    async fetchSeasonFixtures(seasonId){
        try {
            const url = `${this.baseUrl}/schedules/seasons/${seasonId}?api_token=${this.token}`
            const response = await fetch(url)
            if(!response.ok){
                throw new Error(`API Error fetchSeasonsFixtures : ${response.status}`)
            }
            return await response.json()
        } catch(error){
            console.error('Erreur lors de l\'appel API fetchSeasonsFixtures', error)
            throw error
        }
    }
}