import prisma from '../lib/prisma';

const deleteLeague = async () => {
  const leagueId = 1100;

  try {
    await prisma.$transaction([
      prisma.userFavorite.deleteMany({
        where: { competition_id: leagueId },
      }),
      prisma.teamCompetition.deleteMany({
        where: { competition_id: leagueId },
      }),
      prisma.competitions.delete({
        where: { id: leagueId },
      }),
    ]);
  } catch (err) {
    console.error('une erreur est survenue lors de la suppression');
  } finally {
    await prisma.$disconnect();
  }
};

deleteLeague();
