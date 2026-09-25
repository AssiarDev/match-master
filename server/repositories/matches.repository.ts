import { sportmonksGet } from '../lib/sportmonksClient';
import { ApiResponse, ApiMatch, ApiLiveMatch } from '../types/api';

export interface IMatchRepository {
  fetchMatchesByDate(date: string): Promise<ApiResponse<ApiMatch[]>>;
  fetchMatchesByTeam(teamId: number): Promise<ApiResponse<ApiMatch[]>>;
  fetchLiveMatches(): Promise<ApiResponse<ApiLiveMatch[]>>;
}

export class MatchesRepository implements IMatchRepository {
  fetchMatchesByDate(date: string): Promise<ApiResponse<ApiMatch[]>> {
    return sportmonksGet(
      `/fixtures/date/${date}?include=league;participants;venue;scores`
    );
  }

  fetchMatchesByTeam(teamId: number): Promise<ApiResponse<ApiMatch[]>> {
    return sportmonksGet(
      `/schedules/teams/${teamId}?include=league;participants;venue`
    );
  }

  fetchLiveMatches(): Promise<ApiResponse<ApiLiveMatch[]>> {
    return sportmonksGet(
      '/livescores/inplay?include=league;participants;scores;state;periods'
    );
  }
}
