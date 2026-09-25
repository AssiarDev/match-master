import { sportmonksGet } from '../lib/sportmonksClient';
import { ApiResponse, ApiStanding } from '../types/api';

export interface IStandingRepository {
  fetchStandingBySeason(seasonId: number): Promise<ApiResponse<ApiStanding[]>>;
}

export class StandingRepository implements IStandingRepository {
  fetchStandingBySeason(seasonId: number): Promise<ApiResponse<ApiStanding[]>> {
    return sportmonksGet(
      `/standings/seasons/${seasonId}?include=form;details.type&filters=standingdetailTypes:128,129,130,131,132,133,134,135,136,137,138`
    );
  }
}
