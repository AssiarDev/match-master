import { IStandingRepository } from '../repositories/standings.repository';
import { ITeamService } from './teamService';
import { ILeagueService } from './leagueService';
import { mapDetails } from '../utils/mapDetails';
import { MESSAGES } from '../constants/messages';
import type {
  ApiStanding,
  EnrichedStanding,
  ServiceResult,
} from '../types/api';

export interface IStandingService {
  getStandingFixtures(
    leagueId: number
  ): Promise<ServiceResult<{ standing: EnrichedStanding[] }>>;
}

export class StandingService implements IStandingService {
  constructor(
    private readonly standingRepo: IStandingRepository,
    private readonly teamService: ITeamService,
    private readonly leagueService: ILeagueService
  ) {}

  /**
   * Retrieves the standings for the current season of a given league,
   * enriched with team name and image from the database.
   * A business failure of a called service is returned as is; API and
   * database failures are thrown to the caller.
   * @param leagueId - The ID of the league
   * @returns A ServiceResult containing an array of enriched standings, or NOT_FOUND if the league has no current season
   */
  async getStandingFixtures(
    leagueId: number
  ): Promise<ServiceResult<{ standing: EnrichedStanding[] }>> {
    const seasonResult =
      await this.leagueService.getLeagueCurrentSeason(leagueId);
    if (!seasonResult.success) return seasonResult;
    if (seasonResult.league == null)
      return {
        success: false,
        reason: 'NOT_FOUND',
        message: MESSAGES.league.noCurrentSeason,
      };

    const seasonStandingResult = await this.standingRepo.fetchStandingBySeason(
      seasonResult.league
    );
    const seasonStanding = seasonStandingResult.data || [];
    const teamIds = seasonStanding.map((s: ApiStanding) => s.participant_id);

    const teamsResult = await this.teamService.teamsByIds(teamIds);
    if (!teamsResult.success) return teamsResult;
    const teamsById = Object.fromEntries(
      teamsResult.teams.map((s) => [s.id, s])
    );

    const enriched = seasonStanding.map((s: ApiStanding) => {
      const standings = teamsById[s.participant_id];
      const stats = mapDetails(s.details || []);
      return {
        ...s,
        team_name: standings?.name || `Equipe #${s.team_id}`,
        team_image: standings?.image_path || null,
        team_id: s.team_id,
        ...stats,
      };
    });
    return { success: true, standing: enriched };
  }
}
