import { urlAPI, token } from "../config";

export class StandingRepository {
  private readonly baseUrl: string | undefined;
  private readonly token: string | undefined;

  constructor() {
    this.baseUrl = urlAPI;
    this.token = token;
  }

  async fetchStandingBySeason(seasonId: number): Promise<any> {
    try {
      const url = `${this.baseUrl}/standings/seasons/${seasonId}?api_token=${this.token}&include=form;details.type&filters=standingdetailTypes:128,129,130,131,132,133,134,135,136,137,138`;
      const response = await fetch(url);
      if (!response.ok)
        throw new Error(
          `API Error fetchStandingBySeason : ${response.status}`
        );
      return response.json();
    } catch (error: any) {
      console.error(
        "Une erreur est survenue lors de l'\u00e9xecution de fetchStandingBySeason",
        error
      );
      throw error;
    }
  }
}
