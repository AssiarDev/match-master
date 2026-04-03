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
    for (const team of teams) {
      console.log('Trying to link team:', team.id, 'to league:', league.id);
      await prisma.teamCompetition.upsert({
        where: {
          team_id_competition_id: {
            team_id: team.id,
            competition_id: league.id,
          },
        },
        update: {},
        create: { team_id: team.id, competition_id: league.id },
      });
    }
    console.log(`League ${league.id} : ${teams.length} équipes liées`);
  }
  await prisma.$disconnect();
};

insertTeamLeague();
