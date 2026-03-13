import { urlAPI, token } from "../config.js";

export class ScorersRepository{
    constructor(){
        this.baseUrl = urlAPI
        this.token = token
    }

    async fetchTopScorers(seasonId){
        try {
            const url = `${this.baseUrl}/topscorers/seasons/${seasonId}?api_token=${this.token}&filters=seasonTopscorerTypes:208`;
            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(` API Error fetchTopScorers : ${response.status}`)
            }

            return await response.json()
        } catch (error){
            console.error('Erreur impossible de récupérer les données :', error.message);
        }
    }
}