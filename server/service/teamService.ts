import { ILeagueApiRepository } from '../repositories/leagueApi.repository';
import { ISeasonRepository } from '../repositories/season.repository';
import { ITeamDBRepository } from '../repositories/teamDB.repository';
import type {
  ApiSeason,
  ApiTeam,
  ServiceError,
  ServiceResult,
} from '../types/api';

export interface ITeamService {
  allTeams(): Promise<
    Awaited<ReturnType<ITeamDBRepository['findAllTeams']>> | ServiceError
  >;
  teamById(
    teamId: number
  ): Promise<Awaited<ReturnType<ITeamDBRepository['findById']>> | ServiceError>;
  teamsByIds(
    teamIds: number[]
  ): Promise<
    Awaited<ReturnType<ITeamDBRepository['findByIds']>> | ServiceError
  >;
  teamByLeague(leagueId: number): Promise<
    | {
        success: true;
        teams: NonNullable<
          Awaited<ReturnType<ITeamDBRepository['findByLeague']>>
        >['teams'];
      }
    | ServiceError
  >;
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

  async allTeams(): Promise<
    Awaited<ReturnType<ITeamDBRepository['findAllTeams']>> | ServiceError
  > {
    const teams = await this.teamDBRepo.findAllTeams();
    if (!teams)
      return {
        success: false,
        message: 'Impossible de récupérer toutes les équipes.',
      };
    return teams;
  }

  async teamById(
    teamId: number
  ): Promise<
    Awaited<ReturnType<ITeamDBRepository['findById']>> | ServiceError
  > {
    const team = await this.teamDBRepo.findById(teamId);
    if (!team)
      return { success: false, message: "Equipe introuvable via l'id." };
    return team;
  }

  async teamsByIds(
    teamIds: number[]
  ): Promise<
    Awaited<ReturnType<ITeamDBRepository['findByIds']>> | ServiceError
  > {
    const team = await this.teamDBRepo.findByIds(teamIds);
    if (!team)
      return { success: false, message: "Equipes introuvable via l'id." };
    return team;
  }

  async teamByLeague(leagueId: number): Promise<
    | {
        success: true;
        teams: NonNullable<
          Awaited<ReturnType<ITeamDBRepository['findByLeague']>>
        >['teams'];
      }
    | ServiceError
  > {
    const league = await this.teamDBRepo.findByLeague(leagueId);
    if (!league)
      return {
        success: false as const,
        message: 'Equipe introuvable via la ligue.',
      };
    return {
      success: true as const,
      teams: league.teams,
    };
  }

  async teamsForLeague(
    leagueId: number
  ): Promise<
    ServiceResult<{ result: { season: ApiSeason; teams: ApiTeam[] } }>
  > {
    try {
      const seasonData = await this.leagueApiRepo.fetchLeagueSeasons(leagueId);
      const seasons = seasonData.data?.seasons ?? [];
      const activeSeason = seasons.find(
        (s: ApiSeason) => s.is_current === true
      );
      if (!activeSeason)
        return { success: false, message: 'No active season found' };
      const teamsData = await this.seasonRepo.fetchSeasonsTeams(
        activeSeason.id
      );
      const result = {
        season: activeSeason,
        teams: teamsData.data?.teams ?? [],
      };
      return { success: true, result };
    } catch (error) {
      return {
        success: false,
        message: `Impossible de récupérer les équipes pour la ligue : ${error}`,
      };
    }
  }
}
