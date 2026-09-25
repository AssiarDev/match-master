import { sportmonksGet } from '../lib/sportmonksClient';
import { ApiResponse, ApiSquad } from '../types/api';

export interface ITeamApiRepository {
  fetchTeamSquad(
    seasonId: number,
    teamId: number
  ): Promise<ApiResponse<ApiSquad[]>>;
}

export class TeamApiRepository implements ITeamApiRepository {
  fetchTeamSquad(
    seasonId: number,
    teamId: number
  ): Promise<ApiResponse<ApiSquad[]>> {
    return sportmonksGet(
      `/squads/seasons/${seasonId}/teams/${teamId}?include=player`
    );
  }
}
