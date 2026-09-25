import { sportmonksGet } from '../lib/sportmonksClient';
import { ApiResponse, ApiScorer } from '../types/api';

export interface IScorersRepository {
  fetchTopScorers(seasonId: number): Promise<ApiResponse<ApiScorer[]>>;
}

export class ScorersRepository implements IScorersRepository {
  fetchTopScorers(seasonId: number): Promise<ApiResponse<ApiScorer[]>> {
    return sportmonksGet(
      `/topscorers/seasons/${seasonId}?filters=seasonTopscorerTypes:208`
    );
  }
}
