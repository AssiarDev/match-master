import { PrismaClient } from '@prisma/client';
import { TeamService } from '../service/teamService.js';

const prisma = new PrismaClient();
const teamService = new TeamService()

const insertTeamLeague = async () => {
  const leagues = await prisma.competitions.findMany();

  for (const league of leagues) {
    const teams = await teamService.teamsForLeague(league.id);

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
        create: {
          team_id: team.id,
          competition_id: league.id,
        },
      });
    }

    console.log(`League ${league.id} : ${teams.length} équipes liées`);
  }

  await prisma.$disconnect();
};

insertTeamLeague();
