import { urlAPI, token } from "../config";

export class ScorersRepository {
  private readonly baseUrl: string | undefined;
  private readonly token: string | undefined;

  constructor() {
    this.baseUrl = urlAPI;
    this.token = token;
  }

  async fetchTopScorers(seasonId: number): Promise<any> {
    try {
      const url = `${this.baseUrl}/topscorers/seasons/${seasonId}?api_token=${this.token}&filters=seasonTopscorerTypes:208`;
      const response = await fetch(url);
      if (!response.ok)
        throw new Error(
          ` API Error fetchTopScorers : ${response.status}`
        );
      return await response.json();
    } catch (error: any) {
      console.error(
        "Erreur impossible de r\u00e9cup\u00e9rer les donn\u00e9es :",
        error.message
      );
    }
  }
}
