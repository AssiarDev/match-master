import { urlAPI, token } from "../config.js";

export class StandingRepository{
    constructor(){
        this.baseUrl = urlAPI
        this.token = token
    }

    async fetchStandingBySeason(seasonId){
        try {
            const url = `${this.baseUrl}/standings/seasons/${seasonId}?api_token=${this.token}&include=form;details.type&filters=standingdetailTypes:128,129,130,131,132,133,134,135,136,137,138`
            const response = await fetch(url)
            if(!response.ok){
                throw new Error(`API Error fetchStandingBySeason : ${response.status}`)
            }

            return response.json()
        } catch (error){
            console.error('Une erreur est survenue lors de l\'éxecution de fetchStandingBySeason', error)
            throw error
        }
    }
}