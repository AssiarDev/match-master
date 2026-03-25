import { StandingRepository } from "../repositories/standings.repository";
import { TeamService } from "./teamService";
import { LeagueService } from "./leagueService";
import { mapDetails } from "../utils/mapDetails";
import { ApiStanding } from "../types/api";

const standingRepo = new StandingRepository();
const teamService = new TeamService();
const leagueService = new LeagueService();

export class StandingService {
  async getStandingFixtures(leagueId: number) {
    try {
      const seasonResult =
        await leagueService.getLeagueCurrentSeason(leagueId);
      const seasonId = seasonResult.league!;
      const seasonStandingResult =
        await standingRepo.fetchStandingBySeason(seasonId);
      const seasonStanding = seasonStandingResult.data || [];
      const teamIds = seasonStanding.map((s: ApiStanding) => s.participant_id);
      const teams = await teamService.teamsByIds(teamIds);
      if ('success' in teams && !teams.success) throw new Error(teams.message);
      const teamsArray = teams as { id: number; name: string; image_path: string | null }[];
      const teamsById = Object.fromEntries(
        teamsArray.map((s) => [s.id, s])
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
    } catch (error) {
      return {
        success: false,
        message: `Impossible de récupérer le classement ${error}`,
      };
    }
  }
}
