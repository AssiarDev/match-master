import { urlAPI, token } from "../config.js";

export class TeamApiRepository {
    constructor(){
        this.baseUrl = urlAPI
        this.token = token
    }

    async fetchTeamSquad(seasonId, teamId){
        try {
            const url = `${this.baseUrl}/seasons/${seasonId}/teams/${teamId}?api_token=${this.token}&includes=player`
            const response = await fetch(url)

            if(response.ok){
                throw new Error(`API Error fetchTeamSquad : ${response.status}`)
            }

            return await response.json()
        } catch (error) {
            console.error('Erreur fetchTeamSquad :', error.message)
            throw error
        }
    }
}