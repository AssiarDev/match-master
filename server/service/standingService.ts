import { IStandingRepository } from '../repositories/standings.repository';
import { ITeamService } from './teamService';
import { ILeagueService } from './leagueService';
import { mapDetails } from '../utils/mapDetails';
import type { ApiStanding, ServiceResult } from '../types/api';
import type { Stats } from '../utils/mapDetails';

export interface IStandingService {
  getStandingFixtures(leagueId: number): Promise<
    ServiceResult<{
      standing: (ApiStanding &
        Stats & {
          team_name: string;
          team_image: string | null;
          team_id: number;
        })[];
    }>
  >;
}

export class StandingService implements IStandingService {
  constructor(
    private readonly standingRepo: IStandingRepository,
    private readonly teamService: ITeamService,
    private readonly leagueService: ILeagueService
  ) {}

  async getStandingFixtures(leagueId: number): Promise<
    ServiceResult<{
      standing: (ApiStanding &
        Stats & {
          team_name: string;
          team_image: string | null;
          team_id: number;
        })[];
    }>
  > {
    try {
      const seasonResult =
        await this.leagueService.getLeagueCurrentSeason(leagueId);
      if (!seasonResult.success) throw new Error(seasonResult.message);
      if (seasonResult.league == null)
        throw new Error('No current season for this league');
      const seasonId = seasonResult.league;
      const seasonStandingResult =
        await this.standingRepo.fetchStandingBySeason(seasonId);
      const seasonStanding = seasonStandingResult.data || [];
      const teamIds = seasonStanding.map((s: ApiStanding) => s.participant_id);
      const teams = await this.teamService.teamsByIds(teamIds);
      if ('success' in teams && !teams.success) throw new Error(teams.message);
      const teamsArray = teams as {
        id: number;
        name: string;
        image_path: string | null;
      }[];
      const teamsById = Object.fromEntries(teamsArray.map((s) => [s.id, s]));
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
    } catch (error) {
      return {
        success: false,
        message: `Impossible de récupérer le classement ${error}`,
      };
    }
  }
}
