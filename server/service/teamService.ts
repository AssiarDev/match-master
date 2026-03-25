import { LeagueApiRepository } from "../repositories/leagueApi.repository";
import { SeasonRepository } from "../repositories/season.repository";
import { TeamDBRepository } from "../repositories/teamDB.repository";

const teamDBRepo = new TeamDBRepository();
const leagueApiRepo = new LeagueApiRepository();
const seasonRepo = new SeasonRepository();

export class TeamService {
  async allTeams() {
    const teams = await teamDBRepo.findAllTeams();
    if (!teams)
      return {
        success: false,
        message: "Impossible de récupérer toutes les équipes.",
      };
    return teams;
  }

  async teamById(teamId: number) {
    const team = await teamDBRepo.findById(teamId);
    if (!team)
      return { success: false, message: "Equipe introuvable via l'id." };
    return team;
  }

  async teamsByIds(teamIds: number[]) {
    const team = await teamDBRepo.findByIds(teamIds);
    if (!team)
      return { success: false, message: "Equipes introuvable via l'id." };
    return team;
  }

  async teamByLeague(leagueId: number) {
    const team = await teamDBRepo.findByLeague(leagueId);
    if (!team)
      return { success: false, message: "Equipe introuvable via la ligue." };
    return team;
  }

  async teamsForLeague(leagueId: number) {
    try {
      const seasonData = await leagueApiRepo.fetchLeagueSeasons(leagueId);
      const seasons = seasonData.data?.seasons ?? [];
      const activeSeason = seasons.find((s: any) => s.is_current === true);
      if (!activeSeason) return [];
      const teamsData = await seasonRepo.fetchSeasonsTeams(activeSeason.id);
      const result = {
        season: activeSeason,
        teams: teamsData.data?.teams ?? {},
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
