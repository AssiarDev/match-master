import { urlAPI, token } from "../config";
import { ApiResponse, ApiMatch } from "../types/api";

export class MatchesRepository {
  private readonly baseUrl: string;
  private readonly token: string;

  constructor() {
    this.baseUrl = urlAPI;
    this.token = token;
  }

  async fetchMatchesByDate(date: string): Promise<ApiResponse<ApiMatch[]>> {
    try {
      const url = `${this.baseUrl}/fixtures/date/${date}?api_token=${this.token}&include=league;participants;venue;scores`;
      const response = await fetch(url);
      if (!response.ok)
        throw new Error(
          `API Error fetchMatchesByDate : ${response.status}`
        );
      return await response.json();
    } catch (error: unknown) {
      console.error("Erreur de l'appel api", error);
      throw error;
    }
  }

  async fetchMatchesByTeam(teamId: number): Promise<ApiResponse<ApiMatch[]>> {
    try {
      const url = `${this.baseUrl}/schedules/teams/${teamId}?api_token=${this.token}&include=league;participants;venue`;
      const response = await fetch(url);
      if (response.ok)
        throw new Error(
          `API Error fetchMatchesByTeam : ${response.status}`
        );
      return response.json();
    } catch (error: unknown) {
      console.error("Erreur de l'appel api", error);
      throw error;
    }
  }
}
