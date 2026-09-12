import prisma from '../lib/prisma';
import { TeamService } from '../service/teamService';
import { TeamDBRepository } from '../repositories/teamDB.repository';
import { LeagueApiRepository } from '../repositories/leagueApi.repository';
import { SeasonRepository } from '../repositories/season.repository';
const teamService = new TeamService(
  new TeamDBRepository(),
  new LeagueApiRepository(),
  new SeasonRepository()
);

const insertTeamLeague = async (): Promise<void> => {
  const leagues = await prisma.competitions.findMany();
  for (const league of leagues) {
    const teamsResult = await teamService.teamsForLeague(league.id);
    if (!teamsResult.success) continue;
    const teams = teamsResult.result.teams;
    if (teams.length === 0) {
      console.warn(
        `League ${league.id} : aucune équipe renvoyée, liens conservés`
      );
      continue;
    }
    try {
      // Replace the links so relegated teams are detached from the league
      await prisma.$transaction([
        prisma.teamCompetition.deleteMany({
          where: { competition_id: league.id },
        }),
        prisma.teamCompetition.createMany({
          data: teams.map((team) => ({
            team_id: team.id,
            competition_id: league.id,
          })),
          skipDuplicates: true,
        }),
      ]);
      console.log(`League ${league.id} : ${teams.length} équipes liées`);
    } catch (error) {
      console.error(
        `League ${league.id} : liaison impossible`,
        (error as Error).message
      );
    }
  }
  await prisma.$disconnect();
};

insertTeamLeague();
