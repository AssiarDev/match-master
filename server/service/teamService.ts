import { ILeagueApiRepository } from '../repositories/leagueApi.repository';
import { ISeasonRepository } from '../repositories/season.repository';
import { ITeamDBRepository } from '../repositories/teamDB.repository';
import type {
  ApiSeason,
  ApiTeam,
  LeagueTeam,
  ServiceResult,
  TeamDetails,
  TeamSummary,
} from '../types/api';
import { MESSAGES } from '../constants/messages';

export interface ITeamService {
  allTeams(): Promise<ServiceResult<{ teams: TeamSummary[] }>>;
  teamById(teamId: number): Promise<ServiceResult<{ team: TeamDetails }>>;
  teamsByIds(
    teamIds: number[]
  ): Promise<ServiceResult<{ teams: TeamDetails[] }>>;
  teamByLeague(
    leagueId: number
  ): Promise<ServiceResult<{ teams: LeagueTeam[] }>>;
  teamsForLeague(
    leagueId: number
  ): Promise<
    ServiceResult<{ result: { season: ApiSeason; teams: ApiTeam[] } }>
  >;
}

export class TeamService implements ITeamService {
  constructor(
    private readonly teamDBRepo: ITeamDBRepository,
    private readonly leagueApiRepo: ILeagueApiRepository,
    private readonly seasonRepo: ISeasonRepository
  ) {}

  /**
   * Retrieves all teams from the database.
   * @returns A ServiceResult containing the teams (possibly empty)
   */
  async allTeams(): Promise<ServiceResult<{ teams: TeamSummary[] }>> {
    const teams = await this.teamDBRepo.findAllTeams();
    return { success: true, teams };
  }

  /**
   * Retrieves a single team by its ID from the database.
   * @param teamId - The ID of the team
   * @returns A ServiceResult containing the team, or NOT_FOUND
   */
  async teamById(
    teamId: number
  ): Promise<ServiceResult<{ team: TeamDetails }>> {
    const team = await this.teamDBRepo.findById(teamId);
    if (!team)
      return {
        success: false,
        reason: 'NOT_FOUND',
        message: MESSAGES.team.notFound,
      };
    return { success: true, team };
  }

  /**
   * Retrieves multiple teams by their IDs from the database.
   * @param teamIds - An array of team IDs
   * @returns A ServiceResult containing the teams found (possibly empty)
   */
  async teamsByIds(
    teamIds: number[]
  ): Promise<ServiceResult<{ teams: TeamDetails[] }>> {
    const teams = await this.teamDBRepo.findByIds(teamIds);
    return { success: true, teams };
  }

  /**
   * Retrieves all teams belonging to a given league from the database.
   * @param leagueId - The ID of the league
   * @returns A ServiceResult containing the teams, or NOT_FOUND if the league does not exist
   */
  async teamByLeague(
    leagueId: number
  ): Promise<ServiceResult<{ teams: LeagueTeam[] }>> {
    const league = await this.teamDBRepo.findByLeague(leagueId);
    if (!league)
      return {
        success: false,
        reason: 'NOT_FOUND',
        message: MESSAGES.league.notFound,
      };
    return { success: true, teams: league.teams };
  }

  /**
   * Retrieves the teams for the active season of a given league from the external API.
   * An API failure is not caught: it is thrown to the caller.
   * @param leagueId - The ID of the league
   * @returns A ServiceResult containing the active season and its teams, or NOT_FOUND if the league has no active season
   */
  async teamsForLeague(
    leagueId: number
  ): Promise<
    ServiceResult<{ result: { season: ApiSeason; teams: ApiTeam[] } }>
  > {
    const seasonData = await this.leagueApiRepo.fetchLeagueSeasons(leagueId);
    const seasons = seasonData.data?.seasons ?? [];
    const activeSeason = seasons.find((s: ApiSeason) => s.is_current === true);
    if (!activeSeason)
      return {
        success: false,
        reason: 'NOT_FOUND',
        message: MESSAGES.league.noCurrentSeason,
      };
    const teamsData = await this.seasonRepo.fetchSeasonsTeams(activeSeason.id);
    const result = {
      season: activeSeason,
      teams: teamsData.data?.teams ?? [],
    };
    return { success: true, result };
  }
}
