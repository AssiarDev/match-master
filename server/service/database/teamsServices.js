import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getAllTeams = async () => {
  try {
    const teams = await prisma.team.findMany({
      select: {
        id: true,
        name: true,
        image_path: true,
      },
    });

    if (!teams.length) {
      throw new Error('No teams found');
    }

    return teams;
  } catch (error) {
    console.log('Error Prisma in getAllTeams :', error);
    throw error;
  }
};

export const getTeamsById = async (teamIds) => {
  
  return await prisma.team.findMany({
    where: {
      id: { in: teamIds }
    }
  });
}

export const getOneTeamById = async (teamId) => {
  return await prisma.team.findUnique({
    where: { id: teamId }
  })
}

export const teamsByLeague = async (leagueId) => {
    const competition = await prisma.competitions.findUnique({
    where: { id: leagueId },
    include: {
      teams: {
        include: {
          team: true
        }
      }
    }
  });

  const teams = competition.teams.map(tc => ({
    id: tc.team.id,
    name: tc.team.name,
    image: tc.team.image_path,
    shortName: tc.team.short_code
  }));

  return teams
}
