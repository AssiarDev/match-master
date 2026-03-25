import { urlAPI, token } from "../config";

export class MatchesRepository {
  private readonly baseUrl: string | undefined;
  private readonly token: string | undefined;

  constructor() {
    this.baseUrl = urlAPI;
    this.token = token;
  }

  async fetchMatchesByDate(date: string): Promise<any> {
    try {
      const url = `${this.baseUrl}/fixtures/date/${date}?api_token=${this.token}&include=league;participants;venue;scores`;
      const response = await fetch(url);
      if (!response.ok)
        throw new Error(
          `API Error fetchMatchesByDate : ${response.status}`
        );
      return await response.json();
    } catch (error: any) {
      console.error("Erreur de l'appel api", error);
      throw error;
    }
  }

  async fetchMatchesByTeam(teamId: number): Promise<any> {
    try {
      const url = `${this.baseUrl}/schedules/teams/${teamId}?api_token=${this.token}&include=league;participants;venue`;
      const response = await fetch(url);
      if (response.ok)
        throw new Error(
          `API Error fetchMatchesByTeam : ${response.status}`
        );
      return response.json();
    } catch (error: any) {
      console.error("Erreur de l'appel api", error);
      throw error;
    }
  }
}
