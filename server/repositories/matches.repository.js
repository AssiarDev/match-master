import { urlAPI, token } from "../config.js";

export class MatchesRepository {
    constructor(){
        this.baseUrl = urlAPI
        this.token = token
    }

    async fetchLeagueMatches(leagueId){
        try {
            const url = `${this.baseUrl}/fixtures?api_token=${this.token}&filters=league_id:${leagueId};&include=participants;league;scores`
            const response = await fetch(url)

            if(!response.ok){
                throw new Error(`API Error fetchLeagueMatches : ${response.status}`)
            }

            return await response.json()
        } catch (error){
            console.error('Erreur de l\'appel à l\'api', error)
            throw error
        }
    }

    async fetchMatchesByDate(date){
        try {
            const url = `${this.baseUrl}/ fixtures/date/${date}?api_token=${this.token}&include=league;participants;venue;scores`
            const response = await fetch(url)

            if(!response.ok){
                throw new Error(`API Error fetchMatchesByDate : ${response.status}`)
            }

            return await response.json()
        } catch (error){
            console.error('Erreur de l\'appel api', error)
            throw error
        }
    }

    async fetchMatchesByTeam(teamId){
        try {
            const url = `${this.baseUrl}/schedules/teams/${teamId}?api_token=${this.token}&include=league;participants;venue`
            const response = await fetch(url)

            if(response.ok){
                throw new Error(`API Error fetchMatchesByTeam : ${response.status}`)
            }

            return response.json()
        } catch (error){
            console.error('Erreur de l\'appel api', error)
            throw error
        }
    }
}