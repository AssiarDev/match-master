import { urlAPI, token } from "../config";

export class SeasonRepository {
  private readonly baseUrl: string | undefined;
  private readonly token: string | undefined;

  constructor() {
    this.baseUrl = urlAPI;
    this.token = token;
  }

  async fetchSeasonsTeams(seasonId: number): Promise<any> {
    try {
      const url = `${this.baseUrl}/seasons/${seasonId}?api_token=${this.token}&include=teams`;
      const response = await fetch(url);
      if (!response.ok)
        throw new Error(
          ` API Error fetchSeasonsTeams : ${response.status}`
        );
      return await response.json();
    } catch (error: any) {
      console.error("Erreur lors de l'appel API :", error);
      throw error;
    }
  }

  async fetchSeasonFixtures(seasonId: number): Promise<any> {
    try {
      const url = `${this.baseUrl}/schedules/seasons/${seasonId}?api_token=${this.token}`;
      const response = await fetch(url);
      if (!response.ok)
        throw new Error(
          `API Error fetchSeasonsFixtures : ${response.status}`
        );
      return await response.json();
    } catch (error: any) {
      console.error(
        "Erreur lors de l'appel API fetchSeasonsFixtures",
        error
      );
      throw error;
    }
  }
}
