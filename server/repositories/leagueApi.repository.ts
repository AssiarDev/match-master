import { urlAPI, token } from "../config";
import type { ApiResponse, ApiLeague } from "../types/api";

export class LeagueApiRepository {
  private readonly baseUrl: string | undefined;
  private readonly token: string | undefined;

  constructor() {
    this.baseUrl = urlAPI;
    this.token = token;
  }

  async fetchAllLeague(): Promise<ApiResponse<ApiLeague[]>> {
    try {
      const url = `${this.baseUrl}/leagues?api_token=${this.token}`;
      const response = await fetch(url);
      if (!response.ok)
        throw new Error(`API Error fetchAllLeague : ${response.status}`);
      return await response.json();
    } catch (error: unknown) {
      console.error("Erreur fetchAllLeague :", (error as Error).message);
      throw error;
    }
  }

  async fetchLeague(leagueId: number): Promise<ApiResponse<ApiLeague>> {
    try {
      const url = `${this.baseUrl}/leagues/${leagueId}?api_token=${this.token}`;
      const response = await fetch(url);
      if (!response.ok)
        throw new Error(`API Error fetchLeague : ${response.status}`);
      return await response.json();
    } catch (error: unknown) {
      console.error("Erreur fetchLeague :", (error as Error).message);
      throw error;
    }
  }

  async fetchLeagueSeasons(leagueId: number): Promise<ApiResponse<ApiLeague>> {
    try {
      const url = `${this.baseUrl}/leagues/${leagueId}?api_token=${this.token}&includes=seasons`;
      const response = await fetch(url);
      if (!response.ok)
        throw new Error(
          `API Error fetchLeagueSeasons : ${response.status}`
        );
      return await response.json();
    } catch (error: unknown) {
      console.error("Erreur fetchLeagueSeasons :", (error as Error).message);
      throw error;
    }
  }

  async fetchLeagueCurrentSeason(leagueId: number): Promise<ApiResponse<ApiLeague>> {
    try {
      const url = `${this.baseUrl}/leagues/${leagueId}?api_token=${this.token}&includes=currentSeason.stages`;
      const response = await fetch(url);
      if (!response.ok)
        throw new Error(
          `API Error fetchLeagueCurrentSeason : ${response.status}`
        );
      return await response.json();
    } catch (error: unknown) {
      console.error("Erreur fetchLeagueCurrentSeason :", (error as Error).message);
      throw error;
    }
  }

  async fetchLeagueWithSeasons(leagueId: number): Promise<ApiResponse<ApiLeague>> {
    try {
      const url = `${this.baseUrl}/leagues/${leagueId}?api_token=${this.token}&includes=seasons`;
      const response = await fetch(url);
      if (!response.ok)
        throw new Error(
          `API Error fetchLeagueWithSeason : ${response.status}`
        );
      return await response.json();
    } catch (error: unknown) {
      console.error("Erreur fetchLeagueWithSeason :", (error as Error).message);
      throw error;
    }
  }
}
