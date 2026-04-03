import { urlAPI, token } from '../config';
import { ApiResponse, ApiSquad } from '../types/api';

export interface ITeamApiRepository {
  fetchTeamSquad(
    seasonId: number,
    teamId: number
  ): Promise<ApiResponse<ApiSquad[]>>;
}

export class TeamApiRepository implements ITeamApiRepository {
  private readonly baseUrl: string;
  private readonly token: string;

  constructor() {
    this.baseUrl = urlAPI;
    this.token = token;
  }

  async fetchTeamSquad(
    seasonId: number,
    teamId: number
  ): Promise<ApiResponse<ApiSquad[]>> {
    try {
      const url = `${this.baseUrl}/squads/seasons/${seasonId}/teams/${teamId}?api_token=${this.token}&include=player`;
      const response = await fetch(url);
      if (!response.ok) {
        const error = new Error(`API Error fetchTeamSquad : ${response.status}`) as Error & { status: number };
        error.status = response.status;
        throw error;
      }
      return await response.json();
    } catch (error: unknown) {
      console.error('Erreur fetchTeamSquad :', (error as Error).message);
      throw error;
    }
  }
}
