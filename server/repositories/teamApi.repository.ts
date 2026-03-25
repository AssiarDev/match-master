import { urlAPI, token } from "../config";

export class TeamApiRepository {
  private readonly baseUrl: string | undefined;
  private readonly token: string | undefined;

  constructor() {
    this.baseUrl = urlAPI;
    this.token = token;
  }

  async fetchTeamSquad(seasonId: number, teamId: number): Promise<any> {
    try {
      const url = `${this.baseUrl}/squads/seasons/${seasonId}/teams/${teamId}?api_token=${this.token}&include=player`;
      const response = await fetch(url);
      if (!response.ok)
        throw new Error(
          `API Error fetchTeamSquad : ${response.status}`
        );
      return await response.json();
    } catch (error: any) {
      console.error("Erreur fetchTeamSquad :", error.message);
      throw error;
    }
  }
}
