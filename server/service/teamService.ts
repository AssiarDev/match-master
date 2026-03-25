import { LeagueApiRepository } from "../repositories/leagueApi.repository";
import { SeasonRepository } from "../repositories/season.repository";
import { TeamDBRepository } from "../repositories/teamDB.repository";
import type { ApiSeason, ApiTeam, ServiceError, ServiceResult } from "../types/api";

const teamDBRepo = new TeamDBRepository();
const leagueApiRepo = new LeagueApiRepository();
const seasonRepo = new SeasonRepository();

export class TeamService {
  async allTeams(): Promise<Awaited<ReturnType<TeamDBRepository["findAllTeams"]>> | ServiceError> {
    const teams = await teamDBRepo.findAllTeams();
    if (!teams)
      return {
        success: false,
        message: "Impossible de récupérer toutes les équipes.",
      };
    return teams;
  }

  async teamById(teamId: number): Promise<Awaited<ReturnType<TeamDBRepository["findById"]>> | ServiceError> {
    const team = await teamDBRepo.findById(teamId);
    if (!team)
      return { success: false, message: "Equipe introuvable via l'id." };
    return team;
  }

  async teamsByIds(teamIds: number[]): Promise<Awaited<ReturnType<TeamDBRepository["findByIds"]>> | ServiceError> {
    const team = await teamDBRepo.findByIds(teamIds);
    if (!team)
      return { success: false, message: "Equipes introuvable via l'id." };
    return team;
  }

  async teamByLeague(leagueId: number): Promise<ServiceResult< { teams: any[] }>> {
    const league = await teamDBRepo.findByLeague(leagueId);
    if (!league)
      return { success: false, message: "Equipe introuvable via la ligue." };
    return {
      success: true,
      teams: league.teams
    }
  }

  async teamsForLeague(leagueId: number): Promise<ServiceResult<{ result: { season: ApiSeason; teams: ApiTeam[] } }> | []> {
    try {
      const seasonData = await leagueApiRepo.fetchLeagueSeasons(leagueId);
      const seasons = seasonData.data?.seasons ?? [];
      const activeSeason = seasons.find((s: ApiSeason) => s.is_current === true);
      if (!activeSeason) return [];
      const teamsData = await seasonRepo.fetchSeasonsTeams(activeSeason.id);
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
