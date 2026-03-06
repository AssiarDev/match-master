import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getCompetitionsIds = async () => {
  try {
    const competitions = await prisma.competitions.findMany({
      select: { id: true },
    });
    return competitions.map((c) => c.id);
  } catch (error) {
    console.error('Erreur Prisma dans getCompetitionById :', error);
    throw error;
  }
};

export const getAllLeagues = async () => {
  try {
    const competitions = await prisma.competitions.findMany({
      select: {
        id: true,
        country_id: true,
        name: true,
        active: true,
        short_code: true,
        image_path: true,
        type: true,
        sub_type: true,
        category: true,
        has_jerseys: true,
      },
    });

    return competitions;
  } catch (error) {
    console.error('Error Prisma in getAllLeagues :', error);
    throw error;
  }
};

export const getTeamsByCompetitions = async (teamId) => {
  try {
    const teams = await prisma.team.findMany({
      where: { id: teamId },
      select: {
        id: true,
        country_id: true,
        venue_id: true,
        gender: true,
        name: true,
        short_code: true,
        image_path: true,
        founded: true,
        type: true,
        placeholder: true,
        last_played_at: true,
      },
    });

    if (!teams.length) {
      throw new Error(`No team found for the competitions ${id}`);
    }

    return teams;
  } catch (error) {
    console.error('Error Prisma in getTeamsByCompetitions :', error);
    throw error;
  }
};
