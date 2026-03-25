import { urlAPI, token } from "../config";
import { ApiResponse, ApiSquad } from "../types/api";

export class TeamApiRepository {
  private readonly baseUrl: string | undefined;
  private readonly token: string | undefined;

  constructor() {
    this.baseUrl = urlAPI;
    this.token = token;
  }

  async fetchTeamSquad(seasonId: number, teamId: number): Promise<ApiResponse<ApiSquad[]>> {
    try {
      const url = `${this.baseUrl}/squads/seasons/${seasonId}/teams/${teamId}?api_token=${this.token}&include=player`;
      const response = await fetch(url);
      if (!response.ok)
        throw new Error(
          `API Error fetchTeamSquad : ${response.status}`
        );
      return await response.json();
    } catch (error: unknown) {
      console.error("Erreur fetchTeamSquad :", (error as Error).message);
      throw error;
    }
  }
}
